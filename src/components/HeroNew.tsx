import React from 'react';
import { ArrowRight, ChevronRight, BarChart3, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonColorful } from '@/components/ui/button-colorful';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { LogoCarousel } from '@/components/ui/logo-carousel';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import heroDashboard from "@/assets/hero-dashboard.jpg";
import { clientLogos } from '@/components/LogoData';

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
                      Explore o universo
                    </span>
                    <br />
                    <span className="text-muted-foreground">do Tráfego pago</span>
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
                    <ButtonColorful 
                      label="Acessar Portal"
                      className="rounded-xl px-8 py-3 text-base font-semibold"
                    />
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
                  <div className="relative min-h-[14rem] list-none">
                    <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
                      <GlowingEffect
                        spread={40}
                        glow={true}
                        disabled={false}
                        proximity={64}
                        inactiveZone={0.01}
                        borderWidth={3}
                      />
                      <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
                        <div className="relative flex flex-1 flex-col justify-between gap-3">
                          <div className="w-fit mx-auto rounded-lg border-[0.75px] border-border bg-muted p-4">
                            <BarChart3 className="h-8 w-8" />
                          </div>
                          <div className="space-y-3">
                            <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                              Dashboards Avançados
                            </h3>
                            <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                              Visualize suas métricas semanais e mensais com precisão
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative min-h-[14rem] list-none">
                    <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
                      <GlowingEffect
                        spread={40}
                        glow={true}
                        disabled={false}
                        proximity={64}
                        inactiveZone={0.01}
                        borderWidth={3}
                      />
                      <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
                        <div className="relative flex flex-1 flex-col justify-between gap-3">
                          <div className="w-fit mx-auto rounded-lg border-[0.75px] border-border bg-muted p-4">
                            <Shield className="h-8 w-8" />
                          </div>
                          <div className="space-y-3">
                            <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                              Segurança Total
                            </h3>
                            <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                              Dados protegidos com criptografia de ponta
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative min-h-[14rem] list-none">
                    <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
                      <GlowingEffect
                        spread={40}
                        glow={true}
                        disabled={false}
                        proximity={64}
                        inactiveZone={0.01}
                        borderWidth={3}
                      />
                      <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
                        <div className="relative flex flex-1 flex-col justify-between gap-3">
                          <div className="w-fit mx-auto rounded-lg border-[0.75px] border-border bg-muted p-4">
                            <Zap className="h-8 w-8" />
                          </div>
                          <div className="space-y-3">
                            <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                              Performance
                            </h3>
                            <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                              Otimização contínua das suas campanhas
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
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
                    src="/lovable-uploads/95adacff-25e7-437d-8260-9d66ac110d9d.png"
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
          <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center space-y-12">
            <div className="text-center">
              <GradientHeading variant="secondary" size="lg">
                Nossos Clientes
              </GradientHeading>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Confiança de empresas que escolheram nossa expertise em gestão de tráfego
              </p>
            </div>

            <div className="w-full">
              <LogoCarousel columnCount={4} logos={clientLogos} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}