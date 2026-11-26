import { CrmHeader } from "../../components/crm-header";
import { CrmSidebar } from "../../components/crm-sidebar";

export default function CrmLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1 flex-col selection:bg-primary selection:text-primary-foreground">
      <CrmHeader />
      <div className="flex flex-1 flex-col lg:flex-row">
        <CrmSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
