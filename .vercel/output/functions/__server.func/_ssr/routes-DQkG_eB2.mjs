import { o as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, a as Trigger2, i as Root2, n as Header, r as Item, t as Content2 } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-w4A1KCat.mjs";
import { i as Check, r as ChevronDown, t as X } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, o as cn, r as SelectItem, t as Select } from "./select-D53sowPz.mjs";
import { c as _enum, d as object, f as string, l as literal } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
import { n as logFormStart } from "./form-tracking.functions-Cxl8jAQ3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DQkG_eB2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GoldButton({ children, href, className, as, ...rest }) {
	const cls = cn("group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-sm px-8 py-4", "font-sans text-[12px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary-foreground)]", "bg-gold-gradient shadow-[0_10px_40px_-12px_oklch(0.82_0.13_85/45%)]", "transition-all duration-300 hover:shadow-[0_18px_60px_-14px_oklch(0.88_0.15_90/65%)] hover:-translate-y-0.5", "sm:w-auto", className);
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "relative z-10",
		children
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": true,
		className: "pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
	})] });
	if (as === "a" || href) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		className: cls,
		children: inner
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cls,
		...rest,
		children: inner
	});
}
function Wordmark({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			"aria-hidden": true,
			viewBox: "0 0 40 40",
			className: "h-8 w-8 shrink-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "wm-gold",
					x1: "0",
					y1: "0",
					x2: "1",
					y2: "1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "oklch(0.62 0.13 75)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "50%",
							stopColor: "oklch(0.92 0.09 92)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "oklch(0.55 0.11 70)"
						})
					]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "20",
					cy: "20",
					r: "18",
					fill: "none",
					stroke: "url(#wm-gold)",
					strokeWidth: "1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 28 L12 12 L28 28 L28 12",
					stroke: "url(#wm-gold)",
					strokeWidth: "1.5",
					fill: "none",
					strokeLinecap: "square"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: compact ? "leading-tight" : "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-serif text-[15px] font-semibold tracking-[0.32em] text-gold-gradient uppercase",
				children: "Noir"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-sans text-[9px] tracking-[0.42em] text-muted-foreground uppercase",
				children: "Sessions"
			})]
		})]
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "noir-grain relative overflow-hidden px-5 pt-8 pb-20 sm:px-8 sm:pt-12 sm:pb-32",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,oklch(0.82_0.13_85/18%),transparent_70%)] blur-2xl"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "relative mx-auto flex w-full max-w-5xl items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:inline",
					children: "Mentoria Individual"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto mt-20 flex w-full max-w-3xl flex-col items-center text-center sm:mt-28",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-10 bg-gold-gradient" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-sans text-[10px] uppercase tracking-[0.36em] text-gold-gradient font-semibold",
								children: "POUCAS VAGAS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-10 bg-gold-gradient" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-serif text-[34px] leading-[1.08] font-normal text-foreground sm:text-6xl md:text-7xl",
						children: [
							"Acompanhamento",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "italic text-gold-gradient",
								children: "individual"
							}),
							" pra estruturar e escalar sua operação de agência."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg",
						children: "6 encontros individuais de até 2 horas com o Rafa, análise completa da sua operação e uma visita presencial ao escritório da agência. Entrada por aplicação."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 flex w-full flex-col items-center gap-4 sm:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GoldButton, {
							href: "#aplicar",
							children: [
								"QUERO APLICAR",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"PARA UMA VAGA"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "max-w-sm text-center font-sans text-xs leading-relaxed text-muted-foreground whitespace-pre-line",
							children: [
								"Preencha a aplicação e nossa equipe",
								"\n",
								"entra em contato por ligação."
							]
						})]
					})
				]
			})
		]
	});
}
function Section({ id, children, className, eyebrow }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id,
		className: cn("relative w-full px-5 py-20 sm:px-8 sm:py-28 md:py-32", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-3xl",
			children: [eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-8 bg-gold-gradient" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-sans text-[11px] uppercase tracking-[0.28em] text-gold-gradient font-semibold",
					children: eyebrow
				})]
			}) : null, children]
		})
	});
}
function Divider() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl items-center gap-4 px-5 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent via-[color:var(--gold)]/40 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 w-1.5 rotate-45 bg-gold-gradient" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent via-[color:var(--gold)]/40 to-transparent" })
		]
	});
}
function Problem() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "problema",
		eyebrow: "O problema",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "font-serif text-3xl leading-[1.15] font-normal text-foreground sm:text-5xl",
			children: [
				"Você não precisa de mais conteúdo. Precisa de alguém",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "italic text-gold-gradient",
					children: "olhando pra SUA operação."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 space-y-6 font-sans text-base leading-relaxed text-muted-foreground sm:text-[17px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Curso entrega informação. Grupo entrega direção geral. Mas quando o problema é a ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: "SUA"
					}),
					" captação, o",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: "SEU"
					}),
					" chat, a",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: "SUA"
					}),
					" creator que saiu — resposta genérica não resolve."
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "A Noir Sessions individual existe pra isso: colocar a sua operação na mesa, identificar onde ela perde dinheiro e corrigir com quem opera esse mercado todos os dias." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "border-l-2 border-gold-soft pl-5 italic text-foreground/90",
					children: "Sem teoria reciclada. Sem \"depende\". Análise direta do que precisa ser corrigido primeiro — na sua realidade, com os seus números."
				})
			]
		})]
	});
}
var forYou = [
	"Já tem uma operação rodando e travou em captação, retenção, conteúdo ou chat",
	"Está começando do zero e quer estruturar certo desde o primeiro dia, sem meses de tentativa e erro",
	"Quer acesso direto ao expert, sem dividir atenção com uma turma",
	"Está disposto a executar o que for definido nas calls"
];
var notForYou = [
	"Procura fórmula mágica ou renda garantida",
	"Quer só consumir conteúdo sem aplicar",
	"Não pode tratar isso como uma operação profissional"
];
function ForWhom() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "para-quem",
		eyebrow: "Para quem é",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-serif text-3xl leading-tight font-normal text-foreground sm:text-4xl",
			children: "Não é pra todo mundo — e essa é a ideia."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-12 grid gap-6 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-sm border border-gold-soft bg-card/60 p-7 backdrop-blur-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-lg font-semibold text-gold-gradient",
					children: "É pra você se"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 space-y-4",
					children: forYou.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							"aria-hidden": true,
							className: "mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]",
							strokeWidth: 2.5
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-sans text-[15px] leading-relaxed text-foreground/85",
							children: item
						})]
					}, item))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-sm border border-border/60 bg-card/30 p-7 backdrop-blur-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-lg font-semibold text-muted-foreground",
					children: "NÃO é pra você se"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 space-y-4",
					children: notForYou.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							"aria-hidden": true,
							className: "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground",
							strokeWidth: 2.5
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-sans text-[15px] leading-relaxed text-muted-foreground",
							children: item
						})]
					}, item))
				})]
			})]
		})]
	});
}
var calls = [
	{
		n: "01",
		title: "Raio X completo",
		body: "Análise da sua estrutura (ou do seu ponto de partida, se está começando): processos, equipe, números, organização. Saída: diagnóstico do que corrigir primeiro."
	},
	{
		n: "02",
		title: "Plano de execução",
		body: "Transformamos o diagnóstico em plano: prioridades, metas, responsáveis e prazos pro seu ciclo."
	},
	{
		n: "03",
		title: "Captação e retenção de creators",
		body: "Como encontrar creators com potencial, abordar sem parecer golpe, apresentar proposta, fechar contrato — e estruturar o relacionamento pra creator ficar."
	},
	{
		n: "04",
		title: "Aquisição e relevância",
		body: "Canais pra gerar atenção e oportunidade, posicionamento da agência e como parar de depender só de indicação."
	},
	{
		n: "05",
		title: "Chat e conversão",
		body: "A função comercial do chatter: condução de conversa, ofertas, trabalho de compradores, tops e expirados, recorrência e LTV."
	},
	{
		n: "06",
		title: "Revisão e correção",
		body: "Voltamos ao raio X inicial, medimos o que mudou, corrigimos o que travou e definimos os próximos passos da operação."
	}
];
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "como-funciona",
		eyebrow: "Como funciona",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-serif text-3xl leading-[1.15] font-normal text-foreground sm:text-5xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "italic text-gold-gradient",
					children: "6 calls"
				}), " individuais. Até 2 horas cada. Só você e a operação."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-5 sm:grid-cols-2",
				children: calls.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "group relative overflow-hidden rounded-sm border border-border/70 bg-card/40 p-7 transition-all duration-300 hover:border-gold-soft hover:bg-card/70",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-4xl font-normal text-gold-gradient italic",
							children: c.n
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-lg font-semibold text-foreground",
							children: c.title
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-sans text-[14.5px] leading-relaxed text-muted-foreground",
						children: c.body
					})]
				}, c.n))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 border-l-2 border-gold-soft pl-5 font-sans text-sm italic leading-relaxed text-muted-foreground",
				children: "As calls são agendadas diretamente com você, conforme sua disponibilidade. Todas gravadas — você tem acesso às suas gravações."
			})
		]
	});
}
function OfficeVisit() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		id: "visita",
		eyebrow: "Diferencial · Presencial",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-sm border border-gold-soft bg-card/50 p-8 backdrop-blur-sm sm:p-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,oklch(0.82_0.13_85/22%),transparent_70%)] blur-2xl"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-serif text-3xl leading-[1.15] font-normal text-foreground sm:text-5xl",
						children: [
							"Você vai ver a operação por dentro.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "italic text-gold-gradient",
								children: "Presencialmente."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 font-sans text-base leading-relaxed text-muted-foreground sm:text-[17px]",
						children: "Além das 6 calls, você tem direito a uma visita ao escritório da agência: acompanhar a rotina real, ver como a equipe trabalha captação, conteúdo e chat, e entender na prática o que separa uma operação profissional de um improviso."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-8 rounded-sm bg-background/50 p-5 font-sans text-[13px] leading-relaxed text-muted-foreground/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-gold-gradient font-semibold uppercase tracking-wider",
							children: ["Importante ·", " "]
						}), "A visita é agendada em data disponível de ambas as partes e acontece mediante termo de confidencialidade — protegemos os dados das nossas creators e você verá uma operação real, não um cenário montado. Deslocamento e hospedagem por conta do mentorado."]
					})
				]
			})]
		})
	});
}
function Mentor() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "mentor",
		eyebrow: "Quem conduz",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-serif text-3xl leading-tight font-normal text-foreground sm:text-5xl",
				children: [
					"Quem vai olhar pra",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "italic text-gold-gradient",
						children: "sua operação..."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 grid gap-8 sm:grid-cols-[180px_1fr] sm:items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex h-44 w-44 shrink-0 items-center justify-center rounded-sm border border-gold-soft bg-card/60 sm:mx-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-center font-sans text-[10px] uppercase tracking-[0.28em] text-muted-foreground",
						children: "[ Foto do Rafa ]"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-2xl font-semibold text-gold-gradient",
						children: "Rafael Nepomuceno"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 font-sans text-[15.5px] leading-relaxed text-muted-foreground",
						children: [
							"Rafa é fundador da",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: "Hottisie"
							}),
							" e conduz a mentoria pessoalmente. Todas as 6 calls são com ele — sem repassador de conteúdo, sem \"time de suporte\" respondendo por ele. Nas calls que envolvem chat e ferramentas, membros da equipe da operação participam junto."
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-8 bg-gold-gradient" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-sans text-[10px] uppercase tracking-[0.28em] text-muted-foreground",
						children: "Prova social"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-3",
					children: [
						1,
						2,
						3
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex aspect-[4/5] items-center justify-center rounded-sm border border-dashed border-border/70 bg-card/30 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-sans text-[10px] uppercase tracking-[0.24em] text-muted-foreground",
							children: [
								"Inserir print /",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"depoimento ",
								i
							]
						})
					}, i))
				})]
			})
		]
	});
}
var items = [
	{
		title: "Contrato da operação",
		body: "O contrato que usamos com nossas creators, pra você adaptar à sua realidade (recomendamos revisão jurídica antes do uso)."
	},
	{
		title: "Gravações das suas 6 calls",
		body: "Pra revisitar decisões e planos sempre que precisar."
	},
	{
		title: "Acesso às gravações da turma em grupo anterior",
		body: "Você começa a consumir conteúdo antes mesmo da primeira call."
	}
];
function Bonus() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "bonus",
		eyebrow: "Bônus",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "font-serif text-3xl leading-tight font-normal text-foreground sm:text-5xl",
			children: [
				"O que você leva",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "italic text-gold-gradient",
					children: ["\n", "além das calls?"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-12 space-y-6",
			children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-5 border-t border-border/60 pt-6 first:border-t-0 first:pt-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-gradient" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-xl font-semibold text-foreground",
						children: it.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-sans text-[15px] leading-relaxed text-muted-foreground",
						children: it.body
					})]
				})]
			}, it.title))
		})]
	});
}
var steps = [
	"Você preenche o formulário abaixo.",
	"Nossa equipe te liga pra entender seu momento e sua operação.",
	"Se fizer sentido pros dois lados, sua vaga é confirmada na própria call."
];
function Investment() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "investimento",
		eyebrow: "Investimento + Seleção",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-serif text-3xl leading-[1.15] font-normal text-foreground sm:text-5xl",
				children: [
					"Como funciona a",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "italic text-gold-gradient",
						children: "entrada"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 font-sans text-base leading-relaxed text-muted-foreground sm:text-[17px]",
				children: [
					"O acompanhamento individual é limitado a",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground font-semibold",
						children: "2 mentorados"
					}),
					" por ciclo — é o Rafa quem conduz cada call, e a agenda da operação comporta poucas vagas sem comprometer a qualidade da análise."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-6 rounded-sm border border-gold-soft bg-card/50 p-8 sm:grid-cols-[1fr_auto] sm:items-center sm:p-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-sans text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
							children: "Investimento"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-serif text-5xl font-normal text-gold-gradient sm:text-6xl",
							children: "R$ 10.000"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-sans text-sm text-muted-foreground",
							children: "Com opção de parcelamento."
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden h-24 w-px bg-gradient-to-b from-transparent via-[color:var(--gold)]/40 to-transparent sm:block" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm:pl-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-sans text-[13px] leading-relaxed text-muted-foreground",
							children: "Por ser individual e limitado, a entrada é por aplicação."
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-12 space-y-5",
				children: steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-serif text-2xl italic text-gold-gradient shrink-0 leading-none pt-1",
						children: String(i + 1).padStart(2, "0")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-sans text-[15px] leading-relaxed text-foreground/90",
						children: step
					})]
				}, step))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex flex-col items-start gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldButton, {
					href: "#aplicar",
					children: "GARANTIR MINHA VAGA"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-xs leading-relaxed text-muted-foreground",
					children: "\n"
				})]
			})
		]
	});
}
var Accordion = Root2;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger2, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = Trigger2.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = Content2.displayName;
var faqs = [
	{
		q: "Serve pra quem não sabe nada do mercado?",
		a: "Sim. A Call 1 vira o desenho do seu ponto de partida e a Call 2 vira seu plano de entrada. Você constrói certo desde o início em vez de corrigir depois."
	},
	{
		q: "E se eu já tenho agência rodando?",
		a: "Melhor ainda — a análise parte dos seus números e processos reais. O raio X identifica exatamente onde a operação perde dinheiro hoje."
	},
	{
		q: "Por que individual e não em grupo?",
		a: "Porque correção genérica não resolve problema específico. No individual, 100% do tempo de call é sobre a SUA operação."
	},
	{
		q: "As calls são gravadas?",
		a: "Sim, todas. Você recebe as gravações das suas 6 calls."
	},
	{
		q: "Como funciona a visita ao escritório?",
		a: "Agendada em data combinada, mediante termo de confidencialidade. Deslocamento e hospedagem por conta do mentorado."
	},
	{
		q: "Existe parcelamento?",
		a: "Sim. As condições são apresentadas na call de aplicação."
	},
	{
		q: "O que justifica o valor?",
		a: "12 horas de call individual com quem opera o mercado, plano de execução personalizado, contrato da operação, gravações e acesso presencial a uma agência real. Você paga pra pular meses de tentativa e erro."
	},
	{
		q: "Vocês garantem resultado?",
		a: "Não — e desconfie de quem garante. Entregamos processo, direção e correção. O resultado depende da sua execução."
	}
];
function FAQ() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "faq",
		eyebrow: "Perguntas frequentes",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "font-serif text-3xl leading-tight font-normal text-foreground sm:text-5xl",
			children: [
				"Antes que você",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "italic text-gold-gradient",
					children: "pergunte"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
			type: "single",
			collapsible: true,
			className: "mt-12 w-full",
			children: faqs.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
				value: `item-${i}`,
				className: "border-b border-border/70",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
					className: "py-6 text-left font-serif text-[17px] font-semibold text-foreground hover:no-underline sm:text-lg",
					children: f.q
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
					className: "pb-6 font-sans text-[15px] leading-relaxed text-muted-foreground",
					children: f.a
				})]
			}, f.q))
		})]
	});
}
var optionalStr = string().trim().max(200).optional().nullable().transform((v) => v && v.length > 0 ? v : null);
var applicationSchema = object({
	full_name: string().trim().min(2, "Nome muito curto").max(120),
	whatsapp: string().trim().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "WhatsApp inválido").max(20),
	instagram: string().trim().min(1, "Informe seu @").max(60).regex(/^[A-Za-z0-9._]+$/, "Use apenas letras, números, ponto e underline"),
	moment: _enum(["rodando", "zero"]),
	revenue_band: _enum([
		"ate-5k",
		"5-20k",
		"20-50k",
		"acima-50k"
	]).nullable().optional(),
	lgpd_consent: literal(true, { message: "É necessário aceitar o termo de contato" }),
	utm_source: optionalStr,
	utm_medium: optionalStr,
	utm_campaign: optionalStr,
	utm_content: optionalStr,
	utm_term: optionalStr,
	referrer: optionalStr,
	landing_path: optionalStr,
	session_id: optionalStr
});
var submitApplication = createServerFn({ method: "POST" }).inputValidator((data) => applicationSchema.parse(data)).handler(createSsrRpc("0eb51b4df6b0d88ecdda68f490c97172a3b61b1cca7dcca9590a260f83d004f5"));
var STORAGE_KEY = "noir_attribution_v1";
var UTM_KEYS = [
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_content",
	"utm_term"
];
function clean(v) {
	if (!v) return null;
	const s = v.trim().slice(0, 200);
	return s.length ? s : null;
}
function emptyAttribution() {
	return {
		utm_source: null,
		utm_medium: null,
		utm_campaign: null,
		utm_content: null,
		utm_term: null,
		referrer: null,
		landing_path: null
	};
}
/**
* Capture attribution on page load. Uses first-touch: if attribution already
* exists in sessionStorage, do not overwrite it (so a later visit to a page
* without UTMs doesn't erase the original source). If a new URL has UTMs,
* update — treating a fresh UTM'd click as a new touchpoint.
*/
function captureAttribution() {
	if (typeof window === "undefined") return emptyAttribution();
	try {
		const params = new URLSearchParams(window.location.search);
		const hasNewUtm = UTM_KEYS.some((k) => params.get(k));
		const stored = readAttribution();
		if (stored && !hasNewUtm) return stored;
		const referrer = clean(document.referrer);
		const sameOrigin = referrer && referrer.startsWith(window.location.origin);
		const next = {
			utm_source: clean(params.get("utm_source")),
			utm_medium: clean(params.get("utm_medium")),
			utm_campaign: clean(params.get("utm_campaign")),
			utm_content: clean(params.get("utm_content")),
			utm_term: clean(params.get("utm_term")),
			referrer: sameOrigin ? null : referrer,
			landing_path: clean(window.location.pathname + window.location.search)
		};
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
		return next;
	} catch {
		return emptyAttribution();
	}
}
function readAttribution() {
	if (typeof window === "undefined") return null;
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		return {
			...emptyAttribution(),
			...parsed
		};
	} catch {
		return null;
	}
}
function maskWhatsapp(v) {
	const digits = v.replace(/\D/g, "").slice(0, 11);
	if (digits.length <= 2) return digits.length ? `(${digits}` : "";
	if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
	if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
	return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
function ApplicationForm() {
	const submit = useServerFn(submitApplication);
	const logStart = useServerFn(logFormStart);
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [whatsapp, setWhatsapp] = (0, import_react.useState)("");
	const [instagram, setInstagram] = (0, import_react.useState)("");
	const [moment, setMoment] = (0, import_react.useState)("");
	const [revenue, setRevenue] = (0, import_react.useState)("");
	const [consent, setConsent] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const [submittedDdd, setSubmittedDdd] = (0, import_react.useState)("");
	const startLoggedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		captureAttribution();
	}, []);
	function getSessionId() {
		try {
			const KEY = "noir_form_session_id";
			let sid = sessionStorage.getItem(KEY);
			if (!sid) {
				sid = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
				sessionStorage.setItem(KEY, sid);
			}
			return sid;
		} catch {
			return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
		}
	}
	function trackStart() {
		if (startLoggedRef.current) return;
		startLoggedRef.current = true;
		try {
			const STARTED_KEY = "noir_form_started";
			if (sessionStorage.getItem(STARTED_KEY)) return;
			sessionStorage.setItem(STARTED_KEY, "1");
		} catch {}
		const attribution = readAttribution() ?? captureAttribution();
		logStart({ data: {
			session_id: getSessionId(),
			landing_path: attribution.landing_path,
			referrer: attribution.referrer,
			utm_source: attribution.utm_source,
			utm_medium: attribution.utm_medium,
			utm_campaign: attribution.utm_campaign,
			utm_content: attribution.utm_content,
			utm_term: attribution.utm_term
		} }).catch(() => {});
	}
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(whatsapp)) {
			setError("Informe um WhatsApp válido com DDD.");
			return;
		}
		if (!moment) {
			setError("Selecione seu momento.");
			return;
		}
		if (!consent) {
			setError("É necessário aceitar o termo de contato.");
			return;
		}
		setSubmitting(true);
		try {
			const attribution = readAttribution() ?? captureAttribution();
			await submit({ data: {
				full_name: fullName,
				whatsapp,
				instagram: instagram.replace(/^@+/, ""),
				moment,
				revenue_band: moment === "rodando" && revenue ? revenue : null,
				lgpd_consent: true,
				utm_source: attribution.utm_source,
				utm_medium: attribution.utm_medium,
				utm_campaign: attribution.utm_campaign,
				utm_content: attribution.utm_content,
				utm_term: attribution.utm_term,
				referrer: attribution.referrer,
				landing_path: attribution.landing_path,
				session_id: getSessionId()
			} });
			const ddd = whatsapp.match(/\((\d{2})\)/)?.[1] ?? "";
			setSubmittedDdd(ddd);
			setDone(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao enviar. Tente novamente.");
		} finally {
			setSubmitting(false);
		}
	}
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		id: "aplicar",
		eyebrow: "Aplicação recebida",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-sm border border-gold-soft bg-card/60 p-10 text-center backdrop-blur-sm sm:p-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-center justify-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-10 bg-gold-gradient" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-3xl text-gold-gradient",
							children: "✦"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-10 bg-gold-gradient" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-3xl font-normal text-foreground sm:text-4xl",
					children: "Aplicação recebida"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mx-auto mt-6 max-w-md font-sans text-[15px] leading-relaxed text-muted-foreground",
					children: [
						"Nossa equipe vai te ligar em até ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: "24h úteis"
						}),
						submittedDdd ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							" ",
							"a partir de um número com DDD",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground font-semibold",
								children: submittedDdd
							})
						] }) : null,
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-4 max-w-md font-sans text-[13px] leading-relaxed text-muted-foreground/80",
					children: "Fica de olho no WhatsApp — o primeiro contato pode vir por lá."
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "aplicar",
		eyebrow: "Formulário de aplicação",
		className: "pb-32",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-serif text-3xl leading-tight font-normal text-foreground sm:text-5xl",
				children: [
					"Aplique para uma das",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "italic text-gold-gradient",
						children: "vagas"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 font-sans text-base leading-relaxed text-muted-foreground",
				children: "Preencha os dados abaixo. Nossa equipe entra em contato por ligação em até 24h úteis."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				onFocusCapture: trackStart,
				onChangeCapture: trackStart,
				className: "mt-12 space-y-6 rounded-sm border border-border/70 bg-card/50 p-6 backdrop-blur-sm sm:p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nome completo",
						htmlFor: "full_name",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "full_name",
							type: "text",
							required: true,
							maxLength: 120,
							autoComplete: "name",
							value: fullName,
							onChange: (e) => setFullName(e.target.value),
							className: inputCls
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "WhatsApp (com DDD)",
						htmlFor: "whatsapp",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "whatsapp",
							type: "tel",
							inputMode: "tel",
							required: true,
							placeholder: "(00) 00000-0000",
							autoComplete: "tel",
							value: whatsapp,
							onChange: (e) => setWhatsapp(maskWhatsapp(e.target.value)),
							className: inputCls
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "@ do Instagram",
						htmlFor: "instagram",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-stretch overflow-hidden rounded-sm border border-border bg-background focus-within:border-gold-soft focus-within:ring-1 focus-within:ring-[color:var(--gold)]/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex select-none items-center border-r border-border bg-secondary/60 px-3 font-serif text-lg text-gold-gradient",
								children: "@"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "instagram",
								type: "text",
								required: true,
								maxLength: 60,
								autoComplete: "off",
								value: instagram,
								onChange: (e) => setInstagram(e.target.value.replace(/^@+/, "").trim()),
								className: "w-full bg-transparent px-4 py-3 font-sans text-[15px] text-foreground outline-none placeholder:text-muted-foreground/50",
								placeholder: "seuinsta"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Qual seu momento?",
						htmlFor: "moment",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: moment,
							onValueChange: (v) => setMoment(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								id: "moment",
								className: "h-auto py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione…" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "rodando",
								children: "Já tenho agência rodando"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "zero",
								children: "Estou começando do zero"
							})] })]
						})
					}),
					moment === "rodando" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Faturamento mensal aproximado",
						htmlFor: "revenue",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: revenue,
							onValueChange: (v) => setRevenue(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								id: "revenue",
								className: "h-auto py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione…" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "ate-5k",
									children: "Até R$ 5 mil"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "5-20k",
									children: "R$ 5–20 mil"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "20-50k",
									children: "R$ 20–50 mil"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "acima-50k",
									children: "Acima de R$ 50 mil"
								})
							] })]
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex cursor-pointer items-start gap-3 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							required: true,
							checked: consent,
							onChange: (e) => setConsent(e.target.checked),
							className: "mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[color:var(--gold)]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-sans text-[13px] leading-relaxed text-muted-foreground",
							children: "Autorizo o contato por telefone e WhatsApp e o uso dos meus dados para essa finalidade."
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "rounded-sm border border-destructive/50 bg-destructive/10 px-4 py-3 font-sans text-sm text-destructive-foreground",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldButton, {
							type: "submit",
							disabled: submitting,
							children: submitting ? "Enviando…" : "Enviar aplicação"
						})
					})
				]
			})
		]
	});
}
var inputCls = "w-full rounded-sm border border-border bg-background px-4 py-3 font-sans text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-gold-soft focus:ring-1 focus:ring-[color:var(--gold)]/40";
function Field({ label, htmlFor, required, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		htmlFor,
		className: "mb-2 flex items-baseline justify-between font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [label, required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-gold-gradient",
			children: " *"
		}) : null] }), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] normal-case tracking-normal text-muted-foreground/70",
			children: hint
		}) : null]
	}), children] });
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-border/50 px-5 py-14 sm:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-5xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-sans text-xs leading-relaxed text-muted-foreground",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Noir Sessions."
				]
			})]
		})
	});
}
function LandingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Problem, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForWhom, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfficeVisit, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mentor, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bonus, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Investment, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQ, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplicationForm, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { LandingPage as component };
