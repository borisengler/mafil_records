const oidcConfig = {
    authority: 'https://oidc.muni.cz/oidc',
    client_id: '39a00844-84a6-4459-85fb-91d29539088c',
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
    redirect_uri: 'https://records.devel.mafildb.ics.muni.cz/oidc-login',
    response_type: 'code',
    scope: 'openid profile email eduperson_entitlement',
    post_logout_redirect_uri: 'https://records.devel.mafildb.ics.muni.cz/oidc-logout',
    automaticSilentRenew: false
};

export default oidcConfig;