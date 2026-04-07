export function DocumentPrintStyles() {
  return (
    <style>{`
      @media print {
        @page {
          size: A4;
          margin: 1cm;
        }

        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }

        body {
          color: black !important;
          font-size: 12px;
          background: white !important;
        }

        .print\\:hidden {
          display: none !important;
        }

        .border-black {
          border-color: #000 !important;
        }

        .border-b {
          border-bottom-width: 1px !important;
          border-bottom-style: solid !important;
        }

        .border-b-2 {
          border-bottom-width: 2px !important;
          border-bottom-style: solid !important;
        }

        .border-r {
          border-right-width: 1px !important;
          border-right-style: solid !important;
        }

        .border-l {
          border-left-width: 1px !important;
          border-left-style: solid !important;
        }

        .border-t {
          border-top-width: 1px !important;
          border-top-style: solid !important;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }
      }
    `}</style>
  );
}
