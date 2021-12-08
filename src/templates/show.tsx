import {InvoiceJSONSchema} from "../invoiceSchema";
import * as React from 'react'

export function showInvoice(invoice: InvoiceJSONSchema) {
    let rows = []
    const html =

    <table>
        <thead>
            <tr>
                <th>description</th>
                <th>quantity</th>
                <th>unitPriceWithoutTax</th>
                <th>taxPercent</th>
            </tr>
        </thead>
        <tbody>
        {   }
        </tbody>
    </table>
    return <div>
        {invoice.customer.name}
    </div>
}

// var rows = [];
// for (var i = 0; i < numrows; i++) {
//     // note: we are adding a key prop here to allow react to uniquely identify each
//     // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
//     rows.push(<ObjectRow key={i} />);
// }
// return <tbody>{rows}</tbody>;