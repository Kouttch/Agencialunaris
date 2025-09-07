import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CustomerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "João Silva",
    email: "joao@empresa.com",
    phone: "(11) 99999-9999",
    company: "Empresa XYZ Ltda",
    bio: "Empresário focado em marketing digital e crescimento de negócios.",
    avatar: "/placeholder-avatar.jpg"
  });
  const [tempData, setTempData] = useState(profileData);
  const { toast } = useToast();

  const handleEdit = () => {
    setTempData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: Save to database
    setProfileData(tempData);
    setIsEditing(false);
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar and Status */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Foto do Perfil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback className="text-2xl">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-center">
              <h3 className="font-semibold text-lg">{profileData.name}</h3>
              <p className="text-muted-foreground text-sm">{profileData.company}</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="default">Cliente Ativo</Badge>
              <Badge variant="secondary">Premium</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Mantenha seus dados atualizados
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={tempData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">{profileData.name}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={tempData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">{profileData.email}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={tempData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">{profileData.phone}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                {isEditing ? (
                  <Input
                    id="company"
                    value={tempData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">{profileData.company}</div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Sobre</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  rows={3}
                  value={tempData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md min-h-[80px]">{profileData.bio}</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Settings */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Configurações da Conta</CardTitle>
          <CardDescription>
            Gerencie preferências e segurança da conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Preferências</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <span>Notificações por email</span>
                  <Badge variant="outline">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <span>Relatórios semanais</span>
                  <Badge variant="outline">Ativo</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Segurança</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Alterar senha
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Configurar 2FA
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}