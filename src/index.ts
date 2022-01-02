import fastify from 'fastify'
import {compileFromFile} from 'json-schema-to-typescript'
import * as fs from 'fs'
import {renderToString} from 'react-dom/server'
import {showInvoice} from "./templates/show";
import {InvoiceJSONSchema} from "./invoiceSchema";


/* eslint-disable */
const server = fastify({logger: true})

//exercice1
/*
server.post('/invoices', function (request, reply) {
    request.headers.accept = 'application/json'
    reply.type('application/json').send(request.body)
})
*/

server.get('/', (request, reply) => {
    reply.send({hello: 'world'})
})


const schema = {
    "$schema": 'http://json-schema.org/draft-07/schema#',
    "title": 'Invoice JSON schema',
    "$id": "invoiceSchema",
    "type": "object",
    "required": ["reference", "date", "paymentDelayInDays",
        "customer", "biller", "itemInvoices"
    ],
    "additionalProperties": false,
    "properties": {
        "reference": {"type": "string"},
        "customer": {"$ref": "#/$defs/customer"},
        "biller": {"$ref": "#/$defs/biller"},
        "city": {"type": "string"},
        "itemInvoices": {
            "type": "array",
            "items": {"$ref": "#/$defs/itemInvoice"}
        },
        "paymentDelayInDays": {"type": "number"},
        "date": {"type": "string", "format": "date"}
    },
    "$defs": {
        "address": {
            "required": ["street", "city", "zipcode", "country"],
            "additionalProperties": false,
            "type": "object",
            "properties": {
                "street": {"type": "string"},
                "city": {"type": "string"},
                "zipcode": {"type": "string"},
                "state": {"type": ["string", "null"]},
                "additional": {"type": ["string", "null"]},
                "country": {"type": "string"},
            }
        },
        "customer": {
            "required": ["name", "address"],
            "additionalProperties": false,
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "address": {"$ref": "#/$defs/address"}
            }
        },
        "biller": {
            "required": ["address", "phoneNumber", "email", "invoiceLegalFooter"],
            "additionalProperties": false,
            "type": "object",
            "properties": {
                "address": {"$ref": "#/$defs/address"},
                "phoneNumber": {"type": "string"},
                "email": {"type": "string"},
                "invoiceLegalFooter": {"type": "string"}
            }
        },
        "itemInvoice": {
            "required": ["description", "quantity", "unitPriceWithoutTax", "taxPercent"],
            "additionalProperties": false,
            "type": "object",
            "properties": {
                "description": {"type": "string"},
                "quantity": {"type": "number"},
                "unitPriceWithoutTax": {"type": "number"},
                "taxPercent": {"type": "number"}
            }
        }
    }
}
//exercice2
server.addSchema(schema)

//exercice3
const fastifySchema = {
    body: {
        $ref: '#invoice',
        response: {
            200: {
                $ref: '#invoice'
            }
        }
    },
    response: {
        200: {
            $ref: '#invoice'
        }
    }
}

/*server.post('/invoices', {schema: fastifySchema}, (request, reply) => {
    reply.send(request.body)
})*/

server.listen(3000, (err) => {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }
})

compileFromFile("src/invoice.json").then(ts => fs.writeFileSync('src/invoiceSchema.d.ts', ts))

enum MIME_TYPES {
    HTML = 'text/html',
    JSON = 'application/json',
    PDF = 'application/pdf'
}


server.post<{ Body: InvoiceJSONSchema }>('/invoices', (async (request, reply) => {
    switch (request.headers.accept) {
        case MIME_TYPES.JSON:
            request.body
            break
        case MIME_TYPES.PDF:
            throw new Error('PDF are not yet implemented')
        default:
            reply.type(MIME_TYPES.HTML).send(renderToString(await showInvoice(request.body)))
    }
}))