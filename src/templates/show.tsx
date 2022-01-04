import {InvoiceJSONSchema} from "../invoiceSchema";
import * as fs from 'fs/promises';
import * as React from 'react'

export async function showInvoice(invoice: InvoiceJSONSchema) {
    const items = []
    const css = await fs.readFile('./src/templates/show.css', 'utf-8');

    const itemInvoices = invoice.itemInvoices;
    const customer = invoice.customer;
    const biller = invoice.biller;
    const invoiceDate = new Date(invoice.date)

    let totalHT = 0;
    let totalTTC = 0;

    let thereIsADueDate = false;

    let dueDate : Date = new Date();

    // DUE DATE CALC
    if(invoice.paymentDelayInDays !== undefined){
        thereIsADueDate = true;
        const delay = invoice.paymentDelayInDays*24*60*60*1000
        dueDate = new Date(invoiceDate.getTime() + delay)
    }

    // TOTAL CALC
    for(const item of itemInvoices ){
        const amount = item.quantity * item.unitPriceWithoutTax
        const amountTaxes = amount + (item.taxPercent * amount) / 100

        totalHT += amount;
        totalTTC += amountTaxes;
    }

    const html =
    <div className="">
            <style>{css}</style>
          
            <div className="grid-container">
                <div className="invoiceInfos invoiceRef"><p className="bold">Invoice #   </p><p>{invoice.reference} </p></div>

                <div className="" id="biller">
                    <div className="noMargin">
                        <h3>{biller.email}</h3>
                        <p>{biller.phoneNumber}</p>
                        {(() => {
                            if(biller.address?.state !== undefined){
                                return <p>{biller.address?.country}, {biller.address?.state}, {biller.address?.city}, {biller.address?.zipcode}</p>
                            }
                            else{
                                return  <p>{biller.address?.country}, {biller.address?.city}, {biller.address?.zipcode}</p>
                            }
                        })()}
                        <p>{biller.address?.street}</p>
                        <p>{biller.address?.additional}</p>
                    </div>
                </div>

                <div className="" id="customer">
                    <h3>Customer </h3>
                    <div className="noMargin">
                        <p>{customer.name}</p>
                        {(() => {
                        if(customer.address?.state !== undefined){
                            return <p>{customer.address?.country}, {customer.address?.state}, {customer.address?.city}, {customer.address?.zipcode}</p>
                        }
                        else{
                            return  <p>{customer.address?.country}, {customer.address?.city}, {customer.address?.zipcode}</p>
                        }
                        })()}
                        <p>{customer.address?.street}</p>
                        <p>{customer.address?.additional}</p>
                    </div>
                </div>

                <div className="grid-container" id="invoiceInfos">
                    <div className="invoiceDate"><p className="bold">Invoice Date  </p><p> {invoiceDate.toLocaleDateString()}</p></div>
                    {(() => {
                        if(thereIsADueDate){
                            return <div className="delays">
                                        <div className="paymentDelay"><p className="bold">Payment delay  </p><p>{invoice.paymentDelayInDays} days</p></div>  
                                        <div className="dueDate"><p className="bold">Due Date</p><p>{dueDate.toLocaleDateString()}</p></div>
                                    </div>
                        }
                    })()}  
                </div>
        
                <div className="" id="invoiceItems">
                    <table>
                        <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Tax Percent</th>
                            <th>Amount</th>
                            <th>Amount incl. taxes</th>
                        </tr>
                        </thead>
                        <tbody>
                        {itemInvoices.map((object) => {
                        const amount =  object.quantity * object.unitPriceWithoutTax;
                        const amountTaxes = amount + ( object.taxPercent * amount) / 100;
                        return <tr>
                                <td>{object.description}</td>
                                <td>{object.quantity}</td>
                                <td>{object.unitPriceWithoutTax}</td>
                                <td>{object.taxPercent}</td>
                                <td>{amount}</td>
                                <td>{amountTaxes}</td>
                            </tr>
                        })}
                         <tr>
                            <td className="empty" colSpan={4}></td>
                            <td className="totalTitle"> TOTAL excl. taxes</td>
                            <td className="total">{totalHT}</td>
                        </tr>
                        <tr>
                            <td className="empty" colSpan={4}>Thank you for your business</td>
                            <td className="totalTitleTTC"> TOTAL incl. taxes</td>
                            <td className="totalTTC">{totalTTC}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="payment">
                    <h3>Payment</h3>
                    <p>{biller.invoiceLegalFooter}</p>
                </div>
            </div>
    </div>
    return html
}