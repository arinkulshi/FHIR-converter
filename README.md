# FHIR-converter

Tool for converting healthcare data to and from [FHIR (Fast Healthcare Interoperability Resources)](https://www.hl7.org/fhir/) format. This project provides both a client and server implementation for FHIR data conversion, making it easy to integrate with healthcare applications.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- Convert healthcare data to and from FHIR format
- Written in TypeScript for type safety

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

Clone the repository:
```bash
git clone https://github.com/arinkulshi/FHIR-converter.git
cd FHIR-converter
```

Install dependencies:
```bash
npm install
# or
yarn install
```

---

## Project Structure

```
FHIR-converter/
│
├── client/      # Client-side FHIR conversion logic
├── server/      # Server-side API for FHIR conversion
├── flexpa_logo.png
├── .prettierignore
├── README.md
```

---

## Usage

### Running the Server

```bash
cd server
npm start
```

### Using the Client

```bash
cd client
npm start
```


## Contact

Created by [arinkulshi](https://github.com/arinkulshi).  
For questions or support, please open an issue.
