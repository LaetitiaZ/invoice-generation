import {InvoiceJSONSchema} from "../invoiceSchema";
import * as fs from 'fs/promises';
import * as React from 'react'

export async function showInvoice(invoice: InvoiceJSONSchema) {
    const items = []
    const css = await fs.readFile('./src/templates/show.css', 'utf-8');

    for (const [index, value] of invoice.itemInvoices.entries()) {
        items.push(<tr key={index}/>)
    }
    const itemInvoices = invoice.itemInvoices;
    const customer = invoice.customer;
    const biller = invoice.biller;

    const html =
    <div className="grid-container">
            <style>{css}</style>
            <div className="grid-item" id="heading">
                <p>Reference : {invoice.reference} </p>
                <p>Date of invoice : {invoice.date}</p>
                <p>Payment delay : {invoice.paymentDelayInDays} days</p>
            </div>
            <div className="grid-item" id="customer">
                <h3>Customer :</h3>
                <p>{customer.name}</p>
                <p>Address : </p>
                <p>{customer.address?.country}, {customer.address?.state}, {customer.address?.city}, {customer.address?.zipcode}</p>
                <p>{customer.address?.street}</p>
                <p>{customer.address?.additional}</p>
            </div>
            <div className="grid-item" id="biller">
                <h3>Biller :</h3>
                <p>{biller.email}</p>
                <p>{biller.phoneNumber}</p>
                <p>Address : </p>
                <p>{biller.address?.country}, {biller.address?.state}, {biller.address?.city}, {biller.address?.zipcode}</p>
                <p>{biller.address?.street}</p>
                <p>{biller.address?.additional}</p>
            </div>
            <div className="grid-item" id="invoiceItems"></div>
            <table>
                <thead>
                <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>UnitPriceWithoutTax</th>
                    <th>TaxPercent</th>
                </tr>
                </thead>
                <tbody>
                {itemInvoices.map((object) => {
                return <tr>
                        <td>{object.description}</td>
                        <td>{object.quantity}</td>
                        <td>{object.unitPriceWithoutTax}</td>
                        <td>{object.taxPercent}</td>
                    </tr>
                })}
                </tbody>
            </table>
    </div>
    return html
}

// var rows = [];
// for (var i = 0; i < numrows; i++) {
//     // note: we are adding a key prop here to allow react to uniquely identify each
//     // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
//     rows.push(<ObjectRow key={i} />);
// }
// return <tbody>{rows}</tbody>;