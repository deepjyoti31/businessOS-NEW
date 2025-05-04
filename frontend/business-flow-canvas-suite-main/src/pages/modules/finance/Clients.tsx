import { ClientList } from "@/components/finance/ClientList";

const FinanceClients = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">
          Manage your clients and their information
        </p>
      </div>
      
      <ClientList />
    </div>
  );
};

export default FinanceClients;
