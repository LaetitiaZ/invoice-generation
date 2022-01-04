import fastify from 'fastify'
import {compileFromFile} from 'json-schema-to-typescript'
import * as fs from 'fs'
import {renderToString} from 'react-dom/server'
import {showInvoice} from "./templates/show";
import {InvoiceJSONSchema} from "./invoiceSchema";


const server = fastify({logger: true})

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

server.listen(3000, (err) => {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }
})

// COMPILE INVOICE TYPE FROM JSON SCHEMA
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
