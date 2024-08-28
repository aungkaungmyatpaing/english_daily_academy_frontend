export async function fetchUserData(BearerToken) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}` + "user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BearerToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const data = await response.json();
  console.log("user data", data);

  return data;
}
