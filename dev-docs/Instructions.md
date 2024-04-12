# Cloning my GitHub Repository

## Prerequisites

**Node.js and npm:**
   - Ensure Node.js and npm are installed on your machine. You can download them from [Node.js official website](https://nodejs.org/).

**Git:**
   - Ensure Git is installed on your machine. You can download it from [Git official website](https://git-scm.com/).

## Cloning Instructions

### Copy Repository URL

- Go to the GitHub repository page you want to clone.
- Click on the "Code" button (usually green).
- Copy the repository URL (either HTTPS or SSH) or copy it from below:

```https://github.com/Duquesne-Spring-2024-COSC-481/Nicholas-Petronino.git```

### Open Terminal or Command Prompt

- Open your terminal or command prompt on your machine.

### Navigate to Desired Directory

- Change the current working directory to the location where you want to store the cloned repository.

```bash
cd path/to/desired/directory
git clone https://github.com/Duquesne-Spring-2024-COSC-481/Nicholas-Petronino.git
```

- Then verify that the repository has been cloned by performing
```bash
cd Nicholas-Petronino
```

## Node Instructions

- While in your clone of my repository **at the '/you-review' level** run:
  ```bash npm install``` in order to install all the dependencies listed in the package.json file.

- Lastly, to start the node server run:
  ```bash npm start```

## Express Instructions
- While in your clone of my repository **at the '/server' level** run:
  ```bash npm install``` in order to install all the dependencies listed in the package.json file.

- Lastly, to start the express server run:
  ```bash npm start```

# Addtional Information

## Port Numbers:

-The client runs here ```http://localhost:3000```

-The server runs here ```http://localhost:3001``` To get the status of the server, one can navigate to ```http://localhost:3001/status```

# Generating JSDOCS

## Generating JSDocs for Client Side Code:

To generate JSDocs for the client-side code, follow these steps:

1. Make sure you have Node.js installed on your system.
2. Open your terminal or command prompt.
3. Navigate to the root directory of your client-side code (`you-review`).
4. Run the following command:

```npm run jsdoc```

5. JSDocs will be generated for your client-side code and placed in a `docs` directory. Opening the **index.html** file in a browser should display the documentation in a readable format. 


## Generating JSDocs for Server Side Code:

To generate JSDocs for the server-side code, follow these steps:

1. Make sure you have Node.js installed on your system.
2. Open your terminal or command prompt.
3. Navigate to the root directory of your server-side code (`server`)
4. Run the following command:

```npm run jsdoc```

5. JSDocs will be generated for your server-side code and placed in a `docs` directory. Opening the **index.html** file in a browser should display the documentation in a readable format. 

# Running Automated Tests

## Running Automated Tests for the Server:

To run automated tests for the server-side code, follow these steps:

1. Make sure you have Node.js installed on your system.
2. Open your terminal or command prompt.
3. Navigate to the root directory of your server-side code (`server`).
4. Run the following command:

```npm test```

5. Jest will execute the tests specified in your server-side code, and the results will be displayed in the terminal. A coverage report is available in the `/coverage` folder under **index.html**
