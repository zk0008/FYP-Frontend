"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks";

const supabase = createClient();

export function LogoutButton() {
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
      toast({
        title: "Error",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged Out",
        description: "You have successfully logged out. See you soon!",
      });
      router.push("/");
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start p-2"
      onClick={ handleLogout }
    >
      <span>Log Out</span>
    </Button>
  );
}
