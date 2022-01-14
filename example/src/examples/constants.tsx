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