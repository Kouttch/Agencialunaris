export const DeactivatedAccount = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-4xl font-bold text-foreground">Conta Desativada</h1>
        <p className="text-muted-foreground max-w-md">
          Sua conta está temporariamente desativada. Entre em contato com o suporte para mais informações.
        </p>
      </div>
    </div>
  );
};
