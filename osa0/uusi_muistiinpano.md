```mermaid
sequenceDiagram
    participant browser
    participant server
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note Form Data: "note: Wake" 
    activate server
    Note left of server: Server adds the note to the table of notes
    server-->>browser: redirect /exampleapp/notes
    deactivate server
    Note right of browser: Browser loads the page it was directed to
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server
    
    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "PEDRO", "date": "2024-07-17T14:53:37.990Z"}, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes 
```