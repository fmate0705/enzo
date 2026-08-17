import type { DayHours } from '@/lib/store/types';
import { cn } from '@/lib/cn';

/**
 * The week, as a table.
 *
 * Rendered on the server from the same array that feeds the JSON-LD, so the
 * hours a search engine reads and the hours a visitor reads cannot drift apart.
 *
 * Deliberately not "open now / closed now": that needs the visitor's clock, the
 * restaurant's timezone and its holiday closures. With only two of the three, a
 * confident "Nyitva" would be a guess — and a guess that sends someone across
 * town. The week is shown plainly and the phone number sits beside it.
 */
export function OpeningHours({
  hours,
  className,
}: {
  hours: readonly DayHours[];
  className?: string;
}) {
  return (
    <table className={cn('w-full text-sm', className)}>
      <caption className="sr-only">Az Enzo di Napoli nyitvatartása</caption>
      <tbody>
        {hours.map((day) => {
          const closed = day.opens === null;
          return (
            <tr key={day.schemaDay} className="border-b border-border/50 last:border-0">
              <th scope="row" className="py-2.5 text-left font-normal text-muted">
                {day.day}
              </th>
              <td
                className={cn(
                  'py-2.5 text-right tabular-nums',
                  closed ? 'text-muted/70' : 'text-foreground',
                )}
              >
                {closed ? 'Zárva' : `${day.opens}–${day.closes}`}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
