const oidcConfig = {
    authority: 'https://id.muni.cz/oidc/',
    client_id: '39a00844-84a6-4459-85fb-91d29539088c',
    client_secret: '0d1183be-86cb-4bba-8741-4cff2dece283f09529bf-b416-40e3-b62c-1950eda57734',
    redirect_uri: 'https://records.devel.mafildb.ics.muni.cz/oidc-login',
    response_type: 'code',
    scope: 'openid profile email eduperson_entitlement',
    post_logout_redirect_uri: 'https://records.devel.mafildb.ics.muni.cz/oidc-logout',
    automaticSilentRenew: false
};

export default oidcConfig;