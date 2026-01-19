import { UserLogin } from "@/types/UserLogin";
import { PersonResponse } from "@/typesResponse/PersonResponse";
import { getAuthenticatedUser } from "@/utils/store";
import ProfileView from "@components/ProfileView";

export default function Profile() {
  //const user_from_local_storage = getUserFromLocalStorage();

  const userLogin = getAuthenticatedUser() as UserLogin;
  const user: PersonResponse = {
    person_id: userLogin.person.person_id,

    first_name: userLogin.person.first_name,
    last_name: userLogin.person.last_name,
    birthdate: "", // You might want to fetch this data from your backend
    phone: userLogin.person.phone,
    identification: userLogin.person.identification,
    gender: userLogin.person.gender,
    occupation: "",
    marital_status: "",
    education: "",
    email: userLogin.email,

    user_account: {
      user_account_id: userLogin.user_account_id,
      role: userLogin.role.name,
      role_id: userLogin.role.role_id,
      status_id: userLogin.status.status_id,
      status: userLogin.status.name,
    },

    type: null,

    professional_info: null,

    created_by: "",
    creation_date: "",
  };

  return (
    <div>
      <ProfileView user={user} isRowPosition={true} />
    </div>
  );
}
