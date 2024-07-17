import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth/auth.server";

export default function DashboardScreen() {
    const user = useLoaderData<typeof loader>();
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard</p>
            <p>{JSON.stringify({ user })}</p>
        </div>
    );
}

export const loader: LoaderFunction = async ({ request }) => {
    const user = await authenticator.authenticate("jwt", request, {
        failureRedirect: "/login",
    });

    return json({ user });
}