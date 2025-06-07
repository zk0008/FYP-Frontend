"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks";

const supabase = createClient();

export function SignOutButton() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      toast({
        title: "Error",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have successfully signed out. See you soon!",
      });
      router.push("/");
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start p-2"
      onClick={ handleSignOut }
    >
      <span>Sign Out</span>
    </Button>
  );
}
