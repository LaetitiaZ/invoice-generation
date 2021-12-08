Question 1: About input validation:

- How fastify processes unknow properties? 
  
By default, unknown properties are removed as they are considered as additional properties and the Fastify's baseline ajv configuration set removeAddtional to true

- How fastify behaves if a known property is missing in the payload ?

By default, if a property is missing then fastify tries to replace them with defined default values

- What happens if an input property is null?

By default, a property can be null (as for the latest available version of fastify)

Question 2: About response serialisation:

- How fastify processes unknown properties ?

The default serializer compiler being fast-json-stringify, by default fastify ignores unknown properties (unless additionalProperties is set to false by default)

- How fastify behaves if a known property is missing in the payload?

If a known property is missing then it will not be written in the final string 

Question 3: Is input validation just a matter of types and schema?

Input validation is more than just a matter of types and schema, it is also about verifying the syntax and the semantic of the input. 
Meaning that the input must verify business logic (for example, price can't be negative) and also the common syntax (for example, a mailing address)
Input validation should also take into account security aspects, such as authorizations.