# DB Layour

## User

- username [STRING]
- password [STRING with minimum length of 8]
- email [STRING with validation as email]
- address [STRING]
- travel logs [ARRAY of IDs]
- journey plans[ARRAY of IDs]

## Travel Log

- title [STRING]
- description [STRING]
- start date [DATE]
- end date [DATE]
- post date [DATE]
- tags [ARRAY of Strings]

## Journey Plan

- name [STRING]
- journey plan locations [ARRAY of Strings]
- start date [DATE]
- end date [DATE]
- list of activities [ARRAY of Strings]
- description [STRING]
