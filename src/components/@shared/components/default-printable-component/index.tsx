'use client';

import Image from 'next/image';
import mtalentHeader from '@ui/assets/images/mtalent-header.png';
import moldsoftFooter from '@ui/assets/images/moldsoft-footer.png';
import { RefObject } from 'react';

type Props = { content: React.ReactNode; reference?: RefObject<HTMLDivElement | null> };

export default function DefaultPrintableComponent({ content, reference }: Readonly<Props>) {
  return (
    <div ref={reference} className="w-[920px]">
      <table className="print-component">
        <thead>
          <tr>
            <th>
              <header className="mb-10">
                <Image src={mtalentHeader} alt="Header M.Talent Match" className="h-auto w-full" />
              </header>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>{content}</tr>
        </tbody>
        <tfoot className="table-footer">
          <tr>
            <footer className="mt-10 w-full">
              <Image src={moldsoftFooter} alt="Footer Moldsoft" className="h-auto w-full" />
            </footer>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
