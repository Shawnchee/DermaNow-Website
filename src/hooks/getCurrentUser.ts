import { useState, useEffect } from "react";
import { User as SupabaseUser} from "@supabase/supabase-js";
import supabase from "@/utils/supabase";

interface User extends SupabaseUser {
  pet_owned?: string;
  coins?: number;
}


const getCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      setUser(user as User);
    };

    fetchUser();
  }, []);

  return user;
};

export default getCurrentUser;