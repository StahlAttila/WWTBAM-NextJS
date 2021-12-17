export async function signUp(userData) {
  const response = await fetch("/api/auth/users", {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function signIn(credentials) {
  const response = await fetch("/api/auth", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if(response.status === 200) {
    window.localStorage.setItem("wwtbam-token", data.token);
  } 

  return data;
}

export function signOut() {
  try {
    window.localStorage.removeItem("wwtbam-token");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
