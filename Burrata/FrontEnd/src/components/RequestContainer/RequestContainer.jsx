import AdminAuthorizationContainer from '../AdminAuthorizationContainer/AdminAuthorizationContainer.jsx'
import UserVerificationContainer from '../UserVerificationContainer/UserVerificationContainer.jsx'
import VerifiedUserContainer from '../VerifiedUserContainer/VerifiedUserContainer.jsx'


function RequestContainer(props) {
    const {
        loginPage,
        claimsPage,
        verificationPage
    } = props

    return (
        <>
            {loginPage && (
                <AdminAuthorizationContainer/>
            )}
            {claimsPage && (
                <VerifiedUserContainer/>
            )}
            {verificationPage && (
                <UserVerificationContainer/>
            )}
        </>
    )
}

export default RequestContainer