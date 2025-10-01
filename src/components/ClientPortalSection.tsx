import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LogIn, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
export const ClientPortalSection = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const handleMinhaContaClick = () => {
    if (user) {
      navigate("/minha-conta");
    } else {
      navigate("/auth");
    }
  };
  return;
};