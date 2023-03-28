import React, { useEffect, useState } from "react";

import {
  loadClient,
  Widget,
  SearchWidget,
  ExtensionWidget,
  InfoWidget,
  NotificationsProvider,
  Notification,
  StyleContext,
  addOnDeviceChangeHandler,
  PronunciationMyInfoWidget,
  IStyleContext,
  Theme,
  Analytics,
} from "gpdb-widget";
import { useDebouncedCallback } from "use-debounce";
import { me, names } from "./examples/pronunciation-my-info-params";
import Parser from "./parser";
import ScreenResizer from "./dev-tools/ScreenResizer";
import Name, { NameTypes } from "../../src/types/resources/name";
import { TERMS_AND_CONDITIONS_REQUEST_RESULT } from "./examples/constants";
import { loadParams as preferencesLoadParams } from "gpdb-api-client/build/main/types/repositories/client-side-preferences";
import { loadParams as permissionsLoadParams } from "gpdb-api-client/build/main/types/repositories/permissions";
import LanguageSetter from "./dev-tools/LanguageSetter";

const style = {
  margin: "50px auto 0 auto",
};

const creds = {
  accessKeyId: process.env.REACT_APP_GPDB_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_GPDB_SECRET_ACCESS_KEY,
};

const myEmail = me.owner.email;
const mySignature = me.owner.signature;
const mySignatureType = me.owner.signatureType;

const applicationContext = {
  instanceSig: myEmail.split("@")[1],
  typeSig: "email_dns_name",
};
const nameOwnerContext = {
  signature: "armand@test.com",
  email: "armand@test.com",
  signatureType: mySignatureType,
};
const userContext = {
  email: myEmail,
  signature: mySignature,
  signatureType: mySignatureType,
};

const parser = new Parser();

const extensionWidgetNames: { [t in NameTypes]: Name } = {
  firstName: {
    key: "Armand",
    type: "firstName" as NameTypes.FirstName,
    exist: true,
  },
  fullName: {
    key: "Armand De Shaton",
    type: "fullName" as NameTypes.FullName,
    exist: true,
  },
  lastName: {
    key: "De Shaton",
    type: "lastName" as NameTypes.LastName,
    exist: false,
  },
};

const renderWelcomeScreen = false;

const App = () => {
  addOnDeviceChangeHandler();

  const [name, setName] = useState("Jon Snow");
  const [loading, setLoading] = useState(true);
  const client = loadClient(
    creds,
    applicationContext,
    nameOwnerContext,
    userContext,
    parser
  );

  const styleContext: IStyleContext = {
    displayRecorderSavingMessage: true,
    theme: Theme.Outlook,
  };

  useEffect(() => {
    const load = async () => {
      await client.loadPermissions({
        user_sig: userContext.signature,
        user_sig_type: userContext.signatureType,
      } as permissionsLoadParams);
      await client.loadCustomAttributesConfig();
      await client.loadClientPreferences({
        user_sig: userContext.email,
      } as preferencesLoadParams);

      setLoading(false);
    };

    load();
  }, [client]);

  const debounced = useDebouncedCallback((value) => {
    if (value.trim().length === 0) return;
    setName(value);
  }, 600);

  const emailType = "email" as const
  const meGpdb = {
    fullName: me.value,
    email: myEmail,
    signature: mySignature,
    signatureType: emailType,
  }
  const analyticsProviderValue = { 
    name: { value: extensionWidgetNames.fullName.key, type: extensionWidgetNames.fullName.type },
    meGpdb,
    origin: "popup" 
  }
  const analyticsSettings = {
    applicationName: "browser-extension",
    writeKey: "",
  }
  
  const MainApp = () => (
    <div>
      <div>
        Name:
        <input
          defaultValue={name}
          type="text"
          onChange={(e) => debounced(e.target.value)}
          required
          style={{ width: "80%", marginLeft: "20px" }}
        />
      </div>

      {false && !loading && <Widget client={client} name={name} style={style} />}

      { true && !loading && (
        <Analytics.Provider value={analyticsProviderValue} settings={analyticsSettings}>
          <ExtensionWidget
          names={extensionWidgetNames}
          client={client}
          style={style}
        />
        </Analytics.Provider>
      )}

      { false && (
        <StyleContext.Provider value={styleContext}>
          {!loading && <PronunciationMyInfoWidget client={client} name={me} names={names}/>}
          {!loading && <SearchWidget client={client} />}
        </StyleContext.Provider>
      )}

    </div>
  );

  const Wrapper = () => {
    const props = {
      name,
      parser,
      callbackComponent: <MainApp />,
      callbackAction: () => console.log("Terms accepted"),
      documentToRender: TERMS_AND_CONDITIONS_REQUEST_RESULT.data,
      application: applicationContext,
      nameOwner: nameOwnerContext,
      user: userContext,
    };

    return (
      <NotificationsProvider>
        <div style={{ margin: "50px auto 0 auto", width: "320px" }}>
          <ScreenResizer />

          <LanguageSetter />
          {renderWelcomeScreen ? <InfoWidget {...props} /> : <MainApp />}
        </div>

        <Notification />
      </NotificationsProvider>
    );
  };

  return <Wrapper />;
};

export default App;
