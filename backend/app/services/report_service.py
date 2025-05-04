"""
Report service for generating financial reports.
"""

import os
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import calendar
from collections import defaultdict

from supabase import create_client, Client

from app.models.reports import (
    ReportPeriod,
    MonthlyReportItem,
    QuarterlyReportItem,
    ExpenseCategoryItem,
    FinancialSummary,
    MonthlyReport,
    QuarterlyReport,
    ExpenseBreakdownReport,
    AIFinancialInsight,
    FinancialReportResponse
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Month abbreviations
MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# Quarter mapping
QUARTER_MAPPING = {
    1: 'Q1', 2: 'Q1', 3: 'Q1',
    4: 'Q2', 5: 'Q2', 6: 'Q2',
    7: 'Q3', 8: 'Q3', 9: 'Q3',
    10: 'Q4', 11: 'Q4', 12: 'Q4'
}


class ReportService:
    """Service for generating financial reports."""

    def __init__(self):
        """Initialize the report service with Supabase client."""
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
        
        if not supabase_url or not supabase_key:
            logger.error("Supabase URL and key must be provided")
            raise ValueError("Supabase URL and key must be provided")
            
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.table = "transactions"

    async def generate_monthly_report(self, user_id: str, period: ReportPeriod) -> MonthlyReport:
        """
        Generate a monthly financial report.

        Args:
            user_id: The ID of the user
            period: The time period for the report

        Returns:
            Monthly financial report
        """
        # Fetch transactions for the period
        response = self.supabase.table(self.table).select("*") \
            .eq("user_id", user_id) \
            .eq("is_deleted", False) \
            .gte("date", period.start_date.isoformat()) \
            .lte("date", period.end_date.isoformat()) \
            .execute()

        if not response.data:
            # Return empty report if no data
            return MonthlyReport(
                period=period,
                summary=FinancialSummary(
                    total_revenue=0,
                    total_expenses=0,
                    net_profit=0,
                    profit_margin=0,
                    revenue_change=0,
                    expenses_change=0,
                    profit_change=0
                ),
                data=[]
            )

        # Process transactions by month
        monthly_data = self._process_monthly_data(response.data, period)
        
        # Calculate summary
        summary = self._calculate_summary(monthly_data)

        return MonthlyReport(
            period=period,
            summary=summary,
            data=monthly_data
        )

    async def generate_quarterly_report(self, user_id: str, period: ReportPeriod) -> QuarterlyReport:
        """
        Generate a quarterly financial report.

        Args:
            user_id: The ID of the user
            period: The time period for the report

        Returns:
            Quarterly financial report
        """
        # Fetch transactions for the period
        response = self.supabase.table(self.table).select("*") \
            .eq("user_id", user_id) \
            .eq("is_deleted", False) \
            .gte("date", period.start_date.isoformat()) \
            .lte("date", period.end_date.isoformat()) \
            .execute()

        if not response.data:
            # Return empty report if no data
            return QuarterlyReport(
                period=period,
                summary=FinancialSummary(
                    total_revenue=0,
                    total_expenses=0,
                    net_profit=0,
                    profit_margin=0,
                    revenue_change=0,
                    expenses_change=0,
                    profit_change=0
                ),
                data=[]
            )

        # Process transactions by quarter
        quarterly_data = self._process_quarterly_data(response.data, period)
        
        # Calculate summary
        summary = self._calculate_summary_from_quarterly(quarterly_data)

        return QuarterlyReport(
            period=period,
            summary=summary,
            data=quarterly_data
        )

    async def generate_expense_breakdown(self, user_id: str, period: ReportPeriod) -> ExpenseBreakdownReport:
        """
        Generate an expense breakdown report.

        Args:
            user_id: The ID of the user
            period: The time period for the report

        Returns:
            Expense breakdown report
        """
        # Fetch expense transactions for the period
        response = self.supabase.table(self.table).select("*") \
            .eq("user_id", user_id) \
            .eq("is_deleted", False) \
            .eq("type", "Expense") \
            .gte("date", period.start_date.isoformat()) \
            .lte("date", period.end_date.isoformat()) \
            .execute()

        if not response.data:
            # Return empty report if no data
            return ExpenseBreakdownReport(
                period=period,
                summary=FinancialSummary(
                    total_revenue=0,
                    total_expenses=0,
                    net_profit=0,
                    profit_margin=0,
                    revenue_change=0,
                    expenses_change=0,
                    profit_change=0
                ),
                data=[]
            )

        # Process expense categories
        expense_data = self._process_expense_categories(response.data)
        
        # Get summary data (need to fetch income data as well)
        income_response = self.supabase.table(self.table).select("*") \
            .eq("user_id", user_id) \
            .eq("is_deleted", False) \
            .eq("type", "Income") \
            .gte("date", period.start_date.isoformat()) \
            .lte("date", period.end_date.isoformat()) \
            .execute()
        
        total_revenue = sum(transaction["amount"] for transaction in income_response.data) if income_response.data else 0
        total_expenses = sum(abs(transaction["amount"]) for transaction in response.data)
        net_profit = total_revenue - total_expenses
        profit_margin = (net_profit / total_revenue) * 100 if total_revenue > 0 else 0

        summary = FinancialSummary(
            total_revenue=total_revenue,
            total_expenses=total_expenses,
            net_profit=net_profit,
            profit_margin=profit_margin,
            revenue_change=0,  # Would need previous period data
            expenses_change=0,  # Would need previous period data
            profit_change=0     # Would need previous period data
        )

        return ExpenseBreakdownReport(
            period=period,
            summary=summary,
            data=expense_data
        )

    async def generate_financial_report(self, user_id: str, period: ReportPeriod, report_type: str) -> FinancialReportResponse:
        """
        Generate a comprehensive financial report.

        Args:
            user_id: The ID of the user
            period: The time period for the report
            report_type: The type of report to generate

        Returns:
            Financial report response
        """
        response = FinancialReportResponse(
            report_type=report_type,
            period=period
        )

        # Generate monthly data
        if report_type == 'monthly' or report_type == 'all':
            monthly_report = await self.generate_monthly_report(user_id, period)
            response.monthly_data = monthly_report.data
            if not response.summary:
                response.summary = monthly_report.summary

        # Generate quarterly data
        if report_type == 'quarterly' or report_type == 'all':
            quarterly_report = await self.generate_quarterly_report(user_id, period)
            response.quarterly_data = quarterly_report.data
            if not response.summary:
                response.summary = quarterly_report.summary

        # Generate expense breakdown
        if report_type == 'expense_breakdown' or report_type == 'all':
            expense_report = await self.generate_expense_breakdown(user_id, period)
            response.expense_data = expense_report.data
            if not response.summary:
                response.summary = expense_report.summary

        # Generate AI insights (placeholder for now)
        response.insights = self._generate_placeholder_insights()

        return response

    def _process_monthly_data(self, transactions: List[Dict[str, Any]], period: ReportPeriod) -> List[MonthlyReportItem]:
        """Process transaction data into monthly report items."""
        # Initialize monthly data with zeros
        monthly_data = {}
        
        # Get the range of months in the period
        start_month = period.start_date.month
        start_year = period.start_date.year
        end_month = period.end_date.month
        end_year = period.end_date.year
        
        # Initialize all months in the range
        current_month = start_month
        current_year = start_year
        
        while (current_year < end_year) or (current_year == end_year and current_month <= end_month):
            month_abbr = MONTH_ABBR[current_month - 1]
            monthly_data[f"{month_abbr} {current_year}"] = {
                "month": month_abbr,
                "revenue": 0,
                "expenses": 0,
                "profit": 0
            }
            
            current_month += 1
            if current_month > 12:
                current_month = 1
                current_year += 1
        
        # Process transactions
        for transaction in transactions:
            date = datetime.fromisoformat(transaction["date"].replace('Z', '+00:00'))
            month_abbr = MONTH_ABBR[date.month - 1]
            month_key = f"{month_abbr} {date.year}"
            
            if month_key in monthly_data:
                if transaction["type"] == "Income":
                    monthly_data[month_key]["revenue"] += transaction["amount"]
                else:  # Expense
                    monthly_data[month_key]["expenses"] += abs(transaction["amount"])
        
        # Calculate profit for each month
        for month_data in monthly_data.values():
            month_data["profit"] = month_data["revenue"] - month_data["expenses"]
        
        # Convert to list of MonthlyReportItem
        return [MonthlyReportItem(**data) for data in monthly_data.values()]

    def _process_quarterly_data(self, transactions: List[Dict[str, Any]], period: ReportPeriod) -> List[QuarterlyReportItem]:
        """Process transaction data into quarterly report items."""
        # Initialize quarterly data
        quarterly_data = {}
        
        # Get the range of quarters in the period
        start_quarter = QUARTER_MAPPING[period.start_date.month]
        start_year = period.start_date.year
        end_quarter = QUARTER_MAPPING[period.end_date.month]
        end_year = period.end_date.year
        
        # Initialize all quarters in the range
        quarters = ['Q1', 'Q2', 'Q3', 'Q4']
        start_idx = quarters.index(start_quarter)
        end_idx = quarters.index(end_quarter)
        
        for year in range(start_year, end_year + 1):
            for q_idx, quarter in enumerate(quarters):
                if (year == start_year and q_idx < start_idx) or (year == end_year and q_idx > end_idx):
                    continue
                
                quarterly_data[f"{quarter} {year}"] = {
                    "quarter": quarter,
                    "revenue": 0,
                    "expenses": 0,
                    "profit": 0
                }
        
        # Process transactions
        for transaction in transactions:
            date = datetime.fromisoformat(transaction["date"].replace('Z', '+00:00'))
            quarter = QUARTER_MAPPING[date.month]
            quarter_key = f"{quarter} {date.year}"
            
            if quarter_key in quarterly_data:
                if transaction["type"] == "Income":
                    quarterly_data[quarter_key]["revenue"] += transaction["amount"]
                else:  # Expense
                    quarterly_data[quarter_key]["expenses"] += abs(transaction["amount"])
        
        # Calculate profit for each quarter
        for quarter_data in quarterly_data.values():
            quarter_data["profit"] = quarter_data["revenue"] - quarter_data["expenses"]
        
        # Convert to list of QuarterlyReportItem
        return [QuarterlyReportItem(**data) for data in quarterly_data.values()]

    def _process_expense_categories(self, transactions: List[Dict[str, Any]]) -> List[ExpenseCategoryItem]:
        """Process expense transactions into category breakdown."""
        # Group expenses by category
        categories = defaultdict(float)
        total_expenses = 0
        
        for transaction in transactions:
            category = transaction.get("category", "Uncategorized")
            amount = abs(transaction["amount"])
            categories[category] += amount
            total_expenses += amount
        
        # Calculate percentages and create items
        expense_items = []
        for category, amount in categories.items():
            percentage = (amount / total_expenses) * 100 if total_expenses > 0 else 0
            expense_items.append(ExpenseCategoryItem(
                name=category,
                value=amount,
                percentage=percentage
            ))
        
        # Sort by amount descending
        expense_items.sort(key=lambda x: x.value, reverse=True)
        
        return expense_items

    def _calculate_summary(self, monthly_data: List[MonthlyReportItem]) -> FinancialSummary:
        """Calculate financial summary from monthly data."""
        total_revenue = sum(item.revenue for item in monthly_data)
        total_expenses = sum(item.expenses for item in monthly_data)
        net_profit = total_revenue - total_expenses
        profit_margin = (net_profit / total_revenue) * 100 if total_revenue > 0 else 0
        
        # Calculate changes (would need previous period data for accurate calculation)
        # For now, using placeholder values
        revenue_change = 0
        expenses_change = 0
        profit_change = 0
        
        return FinancialSummary(
            total_revenue=total_revenue,
            total_expenses=total_expenses,
            net_profit=net_profit,
            profit_margin=profit_margin,
            revenue_change=revenue_change,
            expenses_change=expenses_change,
            profit_change=profit_change
        )

    def _calculate_summary_from_quarterly(self, quarterly_data: List[QuarterlyReportItem]) -> FinancialSummary:
        """Calculate financial summary from quarterly data."""
        total_revenue = sum(item.revenue for item in quarterly_data)
        total_expenses = sum(item.expenses for item in quarterly_data)
        net_profit = total_revenue - total_expenses
        profit_margin = (net_profit / total_revenue) * 100 if total_revenue > 0 else 0
        
        # Calculate changes (would need previous period data for accurate calculation)
        # For now, using placeholder values
        revenue_change = 0
        expenses_change = 0
        profit_change = 0
        
        return FinancialSummary(
            total_revenue=total_revenue,
            total_expenses=total_expenses,
            net_profit=net_profit,
            profit_margin=profit_margin,
            revenue_change=revenue_change,
            expenses_change=expenses_change,
            profit_change=profit_change
        )

    def _generate_placeholder_insights(self) -> List[AIFinancialInsight]:
        """Generate placeholder AI insights."""
        return [
            AIFinancialInsight(
                insight_type="profit_analysis",
                title="Profit Analysis",
                description="Your profit margin has decreased compared to last quarter. This is primarily due to increased expenses in certain categories.",
                severity="info"
            ),
            AIFinancialInsight(
                insight_type="opportunity",
                title="Opportunity",
                description="Based on your cash flow trends, you could optimize your revenue by focusing on your top-performing categories.",
                severity="info"
            ),
            AIFinancialInsight(
                insight_type="cash_flow_alert",
                title="Cash Flow Alert",
                description="Your expenses have increased significantly. Consider reviewing your spending in non-essential categories.",
                severity="warning"
            )
        ]
