import supabase from "@/utils/supabase"
import { useEffect, useState } from "react";

const fetchUserData =  async (userId: string | undefined) => {

    const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq("id", userId)
    .single();

    if (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
    return userData; 
}

export const useUserData = (userId: string | undefined) => {
    const [userData, setUserData] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Skip the API call if there's no userId
        if (!userId) {
          return;
        }
    
        const fetchUserData = async () => {
          try {
            setLoading(true);
            setError(null);
            
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq("id", userId)
              .single();
    
            // Handle Supabase errors silently
            if (error) {
              console.warn("Could not fetch user data:", error.message);
              setError(error);
              setUserData(null);
              return;
            }
    
            setUserData(data);
          } catch (err) {
            // Handle unexpected errors silently
            console.warn("Unexpected error fetching user data:", err);
            setError(err instanceof Error ? err : new Error(String(err)));
          } finally {
            setLoading(false);
          }
        };
    
        fetchUserData();
      }, [userId]);

      return { data: userData, loading, error };

}
