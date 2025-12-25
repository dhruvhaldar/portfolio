"use client"; import { useEffect } from "react"; import { useRouter } from "next/navigation";

/**
 * A utility component that scrolls to a hashed element ID on page load or hash change.
 * Useful for navigating to specific sections within a page.
 * This component has no visible output (returns null) and only manages side effects.
 */
export default function ScrollToHash() { const router = useRouter(); useEffect(() => { const hash = window.location.hash; if (hash) { const id = hash.replace("#", ""); const element = document.getElementById(id); if (element) { element.scrollIntoView({ behavior: "smooth" }); } } }, [router]); return null; }