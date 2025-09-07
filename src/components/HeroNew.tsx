import React from 'react';
import { ArrowRight, ChevronRight, BarChart3, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import heroDashboard from "@/assets/hero-dashboard.jpg";

export function HeroNew() {
  return (
    <>
      <main className="overflow-hidden">
        <section className="relative min-h-screen">
          <div className="relative pt-24 md:pt-36">
            <BackgroundBeams className="absolute inset-0 -z-10" />
            
            <div aria-hidden className="absolute inset-0 -z-5 size-full bg-gradient-to-b from-transparent via-background/20 to-background/80" />
            
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup preset="blur-slide">
                  <Link to="/auth" className="block">
                    <div className="glass group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-lg transition-all duration-300 hover:shadow-glow cursor-pointer">
                      <span className="text-foreground text-sm">Portal Exclusivo de Gestão de Tráfego</span>
                      <span className="block h-4 w-0.5 border-l border-border bg-border"></span>
                      <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                        <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                          <span className="flex size-6">
                            <ArrowRight className="m-auto size-3" />
                          </span>
                          <span className="flex size-6">
                            <ArrowRight className="m-auto size-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
        
                  <h1 className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] font-black leading-tight">
                    <span style={{ background: 'linear-gradient(135deg, #c9444f, #483a89)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      Explore o Universo
                    </span>
                    <br />
                    <span className="text-muted-foreground">do tráfego pago</span>
                  </h1>
                  
                  <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground leading-relaxed">
                    Portal exclusivo para acompanhar suas campanhas com dashboards avançados, 
                    estratégias personalizadas e gestão completa de investimentos.
                  </p>
                </AnimatedGroup>

                <AnimatedGroup
                  preset="scale"
                  className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row">
                  <div className="glass rounded-2xl border p-1">
                    <Button
                      size="lg"
                      className="rounded-xl px-8 py-3 text-base font-semibold">
                      <span className="text-nowrap">Acessar Portal</span>
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="h-12 rounded-xl px-8 py-3 text-base glass">
                    <span className="text-nowrap">Saiba Mais</span>
                  </Button>
                </AnimatedGroup>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mt-16">
                  <div className="glass p-6 rounded-2xl text-center group hover:shadow-glow transition-all duration-300">
                    <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4 group-hover:animate-pulse" />
                    <h3 className="text-xl font-bold mb-2">Dashboards Avançados</h3>
                    <p className="text-muted-foreground">Visualize suas métricas semanais e mensais com precisão</p>
                  </div>
                  
                  <div className="glass p-6 rounded-2xl text-center group hover:shadow-glow transition-all duration-300">
                    <Shield className="w-12 h-12 text-primary mx-auto mb-4 group-hover:animate-pulse" />
                    <h3 className="text-xl font-bold mb-2">Segurança Total</h3>
                    <p className="text-muted-foreground">Dados protegidos com criptografia de ponta</p>
                  </div>
                  
                  <div className="glass p-6 rounded-2xl text-center group hover:shadow-glow transition-all duration-300">
                    <Zap className="w-12 h-12 text-primary mx-auto mb-4 group-hover:animate-pulse" />
                    <h3 className="text-xl font-bold mb-2">Performance</h3>
                    <p className="text-muted-foreground">Otimização contínua das suas campanhas</p>
                  </div>
                </div>
              </div>
            </div>

            <AnimatedGroup preset="blur-slide">
              <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div
                  aria-hidden
                  className="bg-gradient-to-b to-background from-transparent from-35% absolute inset-0 z-10"
                />
                <div className="glass relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg ring-1 ring-border">
                  <img
                    className="bg-background aspect-[15/8] relative rounded-2xl"
                    src={heroDashboard}
                    alt="Dashboard do portal"
                    width="2700"
                    height="1440"
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
        
        <section className="bg-background pb-16 pt-16 md:pb-32">
          <div className="group relative m-auto max-w-5xl px-6">
            <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
              <div className="block text-sm duration-150 hover:opacity-75">
                <span>Nossos Clientes</span>
                <ChevronRight className="ml-1 inline-block size-3" />
              </div>
            </div>
            <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
              <div className="flex">
                <div className="mx-auto h-5 w-20 bg-muted/20 rounded flex items-center justify-center text-xs">
                  Cliente 1
                </div>
              </div>
              <div className="flex">
                <div className="mx-auto h-5 w-20 bg-muted/20 rounded flex items-center justify-center text-xs">
                  Cliente 2
                </div>
              </div>
              <div className="flex">
                <div className="mx-auto h-5 w-20 bg-muted/20 rounded flex items-center justify-center text-xs">
                  Cliente 3
                </div>
              </div>
              <div className="flex">
                <div className="mx-auto h-5 w-20 bg-muted/20 rounded flex items-center justify-center text-xs">
                  Cliente 4
                </div>
              </div>
              <div className="flex">
                <div className="mx-auto h-5 w-20 bg-muted/20 rounded flex items-center justify-center text-xs">
                  Cliente 5
                </div>
              </div>
              <div className="flex">
                <div className="mx-auto h-5 w-20 bg-muted/20 rounded flex items-center justify-center text-xs">
                  Cliente 6
                </div>
              </div>
              <div className="flex">
                <div className="mx-auto h-5 w-20 bg-muted/20 rounded flex items-center justify-center text-xs">
                  Cliente 7
                </div>
              </div>
              <div className="flex">
                <div className="mx-auto h-5 w-20 bg-muted/20 rounded flex items-center justify-center text-xs">
                  Cliente 8
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}