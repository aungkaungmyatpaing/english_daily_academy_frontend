import React from "react";
import HomePage from "../_components/Home";

export default async function Home() {
  const res = await fetch(`${process.env.API_HOST}` + "home-page/cms", {
    cache: "no-store",
  });

  if (!res.ok) {
    // TO DO : Main Loading State
    throw new Error("Lee pl");
  }

  const data = await res.json();
  const cms = data.data;

  return <HomePage cms={cms} />;
}
