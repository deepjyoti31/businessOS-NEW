"""
Finance reports models.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class ReportPeriod(BaseModel):
    """Model for report time period."""
    start_date: datetime
    end_date: datetime


class MonthlyReportItem(BaseModel):
    """Model for monthly report data item."""
    month: str  # Format: 'Jan', 'Feb', etc.
    revenue: float
    expenses: float
    profit: float


class QuarterlyReportItem(BaseModel):
    """Model for quarterly report data item."""
    quarter: str  # Format: 'Q1', 'Q2', etc.
    revenue: float
    expenses: float
    profit: float


class ExpenseCategoryItem(BaseModel):
    """Model for expense category breakdown."""
    name: str
    value: float
    percentage: float


class FinancialSummary(BaseModel):
    """Model for financial summary statistics."""
    total_revenue: float
    total_expenses: float
    net_profit: float
    profit_margin: float
    revenue_change: float  # Percentage change from previous period
    expenses_change: float  # Percentage change from previous period
    profit_change: float  # Percentage change from previous period


class FinancialReportRequest(BaseModel):
    """Model for financial report request."""
    period: ReportPeriod
    report_type: str  # 'monthly', 'quarterly', 'expense_breakdown'
    include_summary: bool = True


class MonthlyReport(BaseModel):
    """Model for monthly financial report."""
    period: ReportPeriod
    summary: Optional[FinancialSummary] = None
    data: List[MonthlyReportItem]


class QuarterlyReport(BaseModel):
    """Model for quarterly financial report."""
    period: ReportPeriod
    summary: Optional[FinancialSummary] = None
    data: List[QuarterlyReportItem]


class ExpenseBreakdownReport(BaseModel):
    """Model for expense breakdown report."""
    period: ReportPeriod
    summary: Optional[FinancialSummary] = None
    data: List[ExpenseCategoryItem]


class AIFinancialInsight(BaseModel):
    """Model for AI-generated financial insights."""
    insight_type: str  # 'profit_analysis', 'opportunity', 'cash_flow_alert', etc.
    title: str
    description: str
    severity: str  # 'info', 'warning', 'alert'


class FinancialReportResponse(BaseModel):
    """Model for financial report response."""
    report_type: str
    period: ReportPeriod
    summary: Optional[FinancialSummary] = None
    monthly_data: Optional[List[MonthlyReportItem]] = None
    quarterly_data: Optional[List[QuarterlyReportItem]] = None
    expense_data: Optional[List[ExpenseCategoryItem]] = None
    insights: Optional[List[AIFinancialInsight]] = None
