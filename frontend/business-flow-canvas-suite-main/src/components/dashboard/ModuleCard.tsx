
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  icon: React.ReactNode;
  path: string;
  description: string;
  className?: string;
}

const ModuleCard = ({ title, icon, path, description, className }: ModuleCardProps) => {
  return (
    <Link to={path} className={cn("module-card", className)}>
      <div className="p-3 mb-4 rounded-full bg-business-50 text-business-600">
        {icon}
      </div>
      <h3 className="text-base font-medium mb-1">{title}</h3>
      <p className="text-xs text-center text-muted-foreground">{description}</p>
    </Link>
  );
};

export default ModuleCard;
