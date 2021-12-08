import {InvoiceJSONSchema} from "../invoiceSchema";
import * as React from 'react'

export function showInvoice(invoice: InvoiceJSONSchema) {
    const items = []

    for (const [index, value] of invoice.itemInvoices.entries()) {
        items.push(<tr key={index}/>)
    }
    const objects = invoice.itemInvoices;
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
            {objects.map((object) => {
               return <tr>
                    <td>{object.description}</td>
                <td>{object.quantity}</td>
                    <td>{object.unitPriceWithoutTax}</td>
                    <td>{object.taxPercent}</td>
                </tr>
            })}
            </tbody>
        </table>
    return html
}

// var rows = [];
// for (var i = 0; i < numrows; i++) {
//     // note: we are adding a key prop here to allow react to uniquely identify each
//     // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
//     rows.push(<ObjectRow key={i} />);
// }
// return <tbody>{rows}</tbody>;