from routes.auth_admin_route import login_router
from routes.health import health_router
from routes.verif_user_route import verification_router
from routes.save_claims_route import claims_router
from routes.get_all_users_route import getuser_router
from routes.get_all_claims_route import getclaims_router
from routes.get_dates_route import getdates_router
from routes.get_schedule_route import getschedule_router
from routes.save_all_claims_route import all_claims_router
from routes.save_new_worker_route import save_new_worker

all_routers = [
    login_router,
    health_router,
    verification_router,
    claims_router,
    getuser_router,
    getclaims_router,
    getdates_router,
    getschedule_router,
    all_claims_router,
    save_new_worker
]