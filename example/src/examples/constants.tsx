export const TERMS_AND_CONDITIONS_REQUEST_RESULT = {
    id: "asdasdasd",
    name: "outlook_terms_and_conditions",
    data: {
        elements: [
            {
                id: "title",
                name: "general_title",
                type: "raw-html",
                data: "<div className='generalTitle'><style>.generalTitle{font-size: 20px;text-align:center; margin-bottom: 10px;}</style>Terms and Conditions</div>"
            },
            {
                id: "title",
                name: "welcome text",
                type: "raw-html",
                data: "<div>Welcome and thanks for installing NameCoach add-in!!🎊🎊🎊 Before starting to use the add-in, please take a minute to read some important information below.</div>"
            },
            {
                id: "test2",
                name: "user_data",
                type: "collapsible",
                data: {
                    header: {
                        text: "User data",
                        css: "",
                    },
                    body: {
                        children: [
                            {
                                id: "test2",
                                name: "test_name2",
                                type: "raw-html",
                                data: "We are going to use your email(jackgreen@gmail.com) to identify you in our system,  and collect some statistics."
                            },
                        ],
                        css: "",
                    },
                    collapsed: true,
                    css: ""
                }
            },
            {
                id: "test2",
                name: "one_account_one_add_in",
                type: "collapsible",
                data: {
                    header: {
                        text: "One account - one add-in",
                        css: "",
                    },
                    body: {
                        children: [
                            {
                                id: "test2",
                                name: "test_name2",
                                type: "raw-html",
                                data: "if you have more than one email account configured within outlook, you may need to add the add-in to each account."
                            },
                        ],
                        css: "",
                    },
                    css: ""
                }
            },
            {
                id: "test2",
                name: "functionalities",
                type: "collapsible",
                data: {
                    header: {
                        text: "Functionalities",
                        css: "",
                    },
                    body: {
                        name: "body_to_trim",
                        children: [
                            {
                                id: "test2",
                                name: "recording",
                                type: "collapsible",
                                data: {
                                    header: {
                                        text: "* Pronunciation recording",
                                        css: "",
                                    },
                                    body: {
                                        children: [
                                            {
                                                id: "test2",
                                                name: "test_name2",
                                                type: "raw-html",
                                                data: "You can record your name! And probably the names of the others."
                                            },
                                        ],
                                        css: "",
                                    },
                                    css: ""
                                }
                            },
                            {
                                id: "test2",
                                name: "getting",
                                type: "collapsible",
                                data: {
                                    header: {
                                        text: "* Gettting recordings of the names pronunciations",
                                        css: "",
                                    },
                                    body: {
                                        children: [
                                            {
                                                id: "test2",
                                                name: "test_name2",
                                                type: "raw-html",
                                                data: "You can get the pronunciations of the people from your email"
                                            },
                                        ],
                                        css: "",
                                    },
                                    css: ""
                                }
                            },
                            {
                                id: "test2",
                                name: "getting",
                                type: "collapsible",
                                data: {
                                    header: {
                                        text: "* Sharing the pronunciation of your name",
                                        css: "",
                                    },
                                    body: {
                                        children: [
                                            {
                                                id: "test2",
                                                name: "test_name2",
                                                type: "raw-html",
                                                data: "You can share your own pronunciation"
                                            },
                                        ],
                                        css: "",
                                    },
                                    css: ""
                                }
                            },
                            {
                                id: "test2",
                                name: "getting",
                                type: "collapsible",
                                data: {
                                    header: {
                                        text: "* Searching for names pronunciations by name and email",
                                        css: "",
                                    },
                                    body: {
                                        children: [
                                            {
                                                id: "test2",
                                                name: "test_name2",
                                                type: "raw-html",
                                                data: "If you have appropriate policy you can search for pronunciations of any name!"
                                            },
                                        ],
                                        css: "",
                                    },
                                    css: ""
                                }
                            },
                        ],
                        css: ".body_to_trim { margin-left: 10px;",
                    },
                    css: ""
                }
            },
            {
                id: "test2",
                name: "getting",
                type: "collapsible",
                data: {
                    header: {
                        text: "Terms of use ⚠️ ⚠️ ⚠️ ",
                        css: "",
                    },
                    body: {
                        children: [
                            {
                                id: "test2",
                                name: "test_name2",
                                type: "raw-html",
                                data: "By clicking on the button below you agree with <a href=''>terms of use</a> and the information provided above."
                            },
                        ],
                        css: "",
                    },
                    css: ""
                }
            },
        ],
        closeAction: {
          callBackAction: true,
          callBackComponent: true,
          text: "Confirm and get started!",
        },
        generalStyles: `.generalheader {
            font-size: 20px;
            text-align: center;
            margin-bottom: 10px;
        }
    
        .title {
            font-size: 20px;
            text-align: center;
            margin-bottom: 10px;
        }
    
        .collapsible-header {
            display: flex;
            font-size: 16px;
            margin-bottom: 3px;
            font-weight: bold;
            margin-top: 8px;
        }
        
        .collapsible-body {
            margin-bottom: 10px;
        }
        
        .close-button {
            margin-top: 15px;
            text-align: center;
        }
    
        .collapsible_header-row {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
    
        .collapsible_header-row div:first-child {
            margin-top: 5px;
            background-color: red;
        }
        .collapsible-wrapper {
            margin-left: 10px;
        }
        `,
    },
}

// Redesigned Welcome message data below. Just in case it will be lost from BE tables.
// data: {
//   elements: [
//     {
//       id: "title",
//       name: "title",
//       type: "raw-html",
//       data: `
//         <div class="row">
//           <div class="logo_icon_container">
//             <i class="logo_icon"/>
//           </div>

//           <h4 class="message_header">Welcome</h4>
//         </div>
//       `,
//     },
//     {
//       id: "message",
//       name: "message",
//       type: "raw-html",
//       data: `
//         <div class="row">
//           <p class="message">
//             Thank you for installing the NameCoach add-in!
//             <br/>
//             <br/>
//             Now you can easily record and access accurate audio name pronunciations for your contacts.
//             <br/>
//             <br/>
//             Before getting started please read <a href="#">this document</a>.
//             <br/>
//             <br/>
//             <b>By clicking on the ‘Get started’ button you accept the terms of use provided in the document.</b>
//           </p>
//         </div>
//       `,
//     }
//   ],
//   closeAction: {
//     callBackAction: true,
//     callBackComponent: true,
//     text: "Get started!",
//   },
//   generalStyles: `
//     .row {
//       display: flex;
//       flex-direction: row;
//       align-items: flex-start;
//       width: 100%;
//     }

//     .logo_icon_container {
//       margin-right: 18px;
//       display: flex;
//       align-self: center;
//     }
    
//     .logo_icon {
//       width: 20px;
//       height: 17px;
//       display: block;
//       background-repeat: no-repeat;
//       background-position: center;
//       background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAyMCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yLjMxNjk4IDEzLjQ3Nkw0Ljk5NTM1IDEwLjc5NTlMNC45OTUzNSA1LjU1OTJDNC45OTUzNSAzLjg3NDA0IDYuMzY0MTYgMi40ODU2IDguMDc5OTkgMi40ODU2SDE0Ljk1NzFDMTYuNjcyOSAyLjQ4NTYgMTguMDQxOCAzLjg3NDA0IDE4LjA0MTggNS41NTkyVjEyLjQ0MDhDMTguMDQxOCAxNC4xMjYgMTYuNjcyOSAxNS41MTQ0IDE0Ljk1NzEgMTUuNTE0NEgzLjE3NjUxQzIuMDc0ODIgMTUuNTE0NCAxLjU4MTI0IDE0LjIxMjIgMi4zMTY5OCAxMy40NzZaTTAuNjcwNzE2IDE0LjI5ODlDMC42NzA4NzUgMTMuNjg0MyAwLjg5ODkyIDEzLjA1NzcgMS40MDgxOSAxMi41NDgxTDMuNzAzNjMgMTAuMjUxMkwzLjcwMzYzIDEwLjI1MTRMMS40MDgxOSAxMi41NDg0QzAuODk4OTg5IDEzLjA1NzkgMC42NzA5MzYgMTMuNjg0NCAwLjY3MDcxNiAxNC4yOTg5Wk0xOS4zMzM0IDEyLjQ2OTFDMTkuMzMzNCAxMi40NTk3IDE5LjMzMzUgMTIuNDUwMiAxOS4zMzM1IDEyLjQ0MDhMMTkuMzMzNSAxMi40NDFDMTkuMzMzNSAxMi40NTA0IDE5LjMzMzQgMTIuNDU5OCAxOS4zMzM0IDEyLjQ2OTFaTTE5LjMzMzUgNS41NTk0NUwxOS4zMzM1IDUuNTU5MkMxOS4zMzM1IDMuMTQwNjUgMTcuMzc0MSAxLjE4IDE0Ljk1NzEgMS4xOEg4LjA3OTk5QzUuNjY1MzEgMS4xOCAzLjcwNzM5IDMuMTM2ODkgMy43MDM2NCA1LjU1MjI0QzMuNzA3NTMgMy4xMzcwMSA1LjY2NTM5IDEuMTgwMjUgOC4wNzk5OSAxLjE4MDI1SDE0Ljk1NzFDMTcuMzc0MSAxLjE4MDI1IDE5LjMzMzUgMy4xNDA5IDE5LjMzMzUgNS41NTk0NVpNMy4wMzcxMSA1LjU1OTJWOS45NjU2N0wwLjk0MTQ2OCAxMi4wNjI3Qy0xLjA3OTcyIDE0LjA4NTIgMC4zNzkyNTQgMTcuNSAzLjE3NjUxIDE3LjVIMTQuOTU3MUMxNy43MyAxNy41IDIwIDE1LjI0NzMgMjAgMTIuNDQwOFY1LjU1OTJDMjAgMi43NTI3NSAxNy43MyAwLjUgMTQuOTU3MSAwLjVIOC4wNzk5OUM1LjMwNzEgMC41IDMuMDM3MTEgMi43NTI3NSAzLjAzNzExIDUuNTU5MlpNMS4yOTc3OCAxNC4zNTIxQzEuMzIyMDEgMTUuMjk5NSAyLjA2NDU3IDE2LjE5NDYgMy4xNzY1MSAxNi4xOTQ2SDQuMzI4ODNIOS4wNzYyNUgxMC45MTA4SDEyLjU2NzNIMTQuOTU3MUMxNi45NDggMTYuMTk0NiAxOC41NzY2IDE0LjY0MjcgMTguNzAwNyAxMi42ODE5QzE4LjU3NjUgMTQuNjQyNiAxNi45NDc5IDE2LjE5NDQgMTQuOTU3MSAxNi4xOTQ0SDMuMTc2NTFDMi4wNjQ2NyAxNi4xOTQ0IDEuMzIyMTQgMTUuMjk5NCAxLjI5Nzc4IDE0LjM1MjFaTTQuMzI4ODMgNS41NTMyNUM0LjMyODgzIDUuNTU1MzIgNC4zMjg4MyA1LjU1NzM4IDQuMzI4ODMgNS41NTk0NUw0LjMyODgzIDUuNTU5MkM0LjMyODgzIDUuNTU3MjIgNC4zMjg4MyA1LjU1NTIzIDQuMzI4ODMgNS41NTMyNVoiIGZpbGw9IiM3QzRCQjQiLz4KPC9zdmc+Cg==");
//     }

//     .message_header {
//       font-size: 18px;
//       font-weight: 700;
//       margin: 0;
//       color: $colors_dark_grey;
//     }

//     .message {
//       font-size: 16px;
//       font-weight: 500;
//     }
//   `
// },
