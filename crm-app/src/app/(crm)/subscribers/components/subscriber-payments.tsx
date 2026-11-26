import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type SubscriberPaymentRow = {
  paymentId: string;
  date: string;
  amount: string;
  method: string;
  statusLabel: string;
  isPaid: boolean;
};

export function SubscriberPayments({ payments }: { payments: SubscriberPaymentRow[] }) {
  
  if (payments.length === 0) {
    return <p className="py-2 text-muted-foreground">No payments recorded for this subscriber yet.</p>;
  }

  return (
    <Table className="text-[0.8rem]">
      <TableHeader>
        <TableRow className="border-dashed hover:bg-transparent">
          {["Date", "Amount", "Method", "Status"].map((heading) => (
            <TableHead
              key={heading}
              className="h-8 font-mono text-[0.7rem] font-normal tracking-[0.14em] text-muted-foreground uppercase"
            >
              {heading}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.paymentId} className="border-dashed hover:bg-transparent">
            <TableCell>{payment.date}</TableCell>
            <TableCell className="tabular-nums">{payment.amount}</TableCell>
            <TableCell>{payment.method}</TableCell>
            <TableCell className={payment.isPaid ? undefined : "text-muted-foreground"}>{payment.statusLabel}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
