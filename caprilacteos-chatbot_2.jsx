import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `Eres el asistente virtual amigable de CAPRILÁCTEOS LA ESPERANZA, una empresa colombiana que produce y vende leche de cabra pasteurizada de altísima calidad en Cali, Colombia.

Tu nombre es el Asistente de CAPRILÁCTEOS LA ESPERANZA. Hablas de tú a tú, de forma cercana, cálida y amigable, como un buen amigo que conoce muy bien los productos. Usas emojis con moderación para dar calidez. Nunca eres robótico ni frío.

=== INFORMACIÓN DEL NEGOCIO ===

NOMBRE: CAPRILACTEOS LA ESPERANZA ZOMAC SAS
PÁGINA WEB: www.caprilacteos.com
INSTAGRAM: @caprilacteoslaesperanza
FACEBOOK: Caprilacteos la Esperanza
WHATSAPP: 3148276792
TIKTOK: @caprilacteoslaesperanza
HORARIO DE ATENCIÓN HUMANA: 8:00 a.m. a 7:00 p.m. todos los días
UBICACIÓN FINCA: Caloto, Cauca
DESPACHOS DESDE: Cali (punto de acopio y distribución)
ZONA DE ENTREGA: Toda la ciudad de Cali

=== HISTORIA ===
Todo empezó en 2019 como un sueño con una sola cabrita para consumo familiar. Desde principios de 2025 se constituyeron formalmente como empresa. Tienen más de 40 cabras en finca propia. Su producción es artesanal, natural y orgánica. No usan fertilizantes químicos ni fungicidas. Tienen registro INVIMA. Su leche tiene sabor muy neutro y agradable, sin ese "sabor a chivo" que a veces desagrada.

=== PRODUCTOS Y PRECIOS ===
- Leche de Cabra Pasteurizada (1 litro): $13.000 pesos colombianos
- Sin aditivos, sin conservantes, 100% natural
- Vida útil: 3 a 4 días en nevera. Congelada: hasta 1 mes
- Próximamente: Kéfir de leche de cabra

=== PAGOS ===
Nequi, enlace de pago, datáfono, efectivo contra entrega

=== DOMICILIOS ===
- Todos los días de la semana según inventario
- Desde 1 litro en adelante
- Costo de domicilio: $6.000 a $8.000 según distancia del barrio
- Recogida en punto de Cali disponible (avisar con anticipación)
- Mensajería propia para garantizar cadena de frío

=== CÓMO PEDIR ===
1. Escribir al WhatsApp 3148276792
2. Dar: nombre, dirección con barrio, cantidad de litros, método de pago
3. Hacer el pedido con 4 días de anticipación
4. Pagar antes (Nequi/link) o contra entrega
5. Recibirán confirmación manual del equipo

=== BENEFICIOS DE LA LECHE DE CABRA ===
- Digestión fácil: glóbulos de grasa más pequeños, asimilación rápida
- Neutraliza la acidez y gastritis sin efecto rebote
- Contiene ácido caprílico y ácido cáprico (antifúngicos naturales que controlan la Candida)
- Calcio y fósforo de alta biodisponibilidad (previene osteoporosis)
- Caseína A2: no irrita el estómago
- Vitaminas del complejo B: energía y menos fatiga

=== RECOMENDADA PARA ===
Niños (1-12 años), personas con gastritis o estómagos sensibles, adultos mayores, deportistas, personas con intolerancias leves a lácteos de vaca

=== PREGUNTAS FRECUENTES ===
- ¿Tiene local físico? No, despachan desde Cali a domicilio o recogida en punto de acopio
- ¿Sabe a chivo? No, el sabor es muy neutro y agradable, casi igual a la de vaca
- ¿Venden quesos o yogures? Por ahora solo leche pasteurizada. Próximamente kéfir
- ¿Pueden tomarla niños y adultos mayores? Sí, es perfecta para todas las edades
- ¿Es apta para estómagos delicados? Sí, es una de las mejores opciones
- ¿Tiene conservantes? No, es 100% natural con pasteurización e INVIMA

=== INSTRUCCIONES DE COMPORTAMIENTO ===
- Si preguntan algo que no está en este documento pero es de conocimiento general sobre leche de cabra, lácteos o nutrición, puedes responder con tu conocimiento general siempre aclarando que es información general.
- Si no sabes algo específico del negocio o la pregunta requiere una respuesta más precisa y personalizada, diles amablemente algo como: "Esa es una pregunta muy específica que merece una respuesta precisa. Voy a pasarla a nuestro equipo de ventas para que te respondan personalmente con todo el detalle que necesitas. ¡Ellos estarán encantados de ayudarte!" — NUNCA vuelvas a mencionar el número de WhatsApp en estos casos.
- Nunca inventes precios, productos o políticas que no estén aquí
- Siempre termina ofreciendo más ayuda o invitando a hacer el pedido
- Si alguien quiere pedir, dales el paso a paso de cómo hacerlo`;

export default function CaprilacteosChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "¡Hola! 🐐 Soy el asistente virtual de **CAPRILÁCTEOS LA ESPERANZA**. Estoy aquí para contarte todo sobre nuestra leche de cabra fresca y natural, ayudarte con tu pedido o resolver cualquier duda que tengas. ¡Pregúntame lo que quieras!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [...history, { role: "user", content: userMessage }]
        })
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Lo siento, hubo un problema. ¡Intenta de nuevo!";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Ups, tuve un problemita técnico. ¡Intenta de nuevo en un momento! 😊" }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i}>{part.slice(2, -2)}</strong>
        : part
    );
  };

  const suggestedQuestions = [
    "¿Cuánto cuesta la leche?",
    "¿Hacen domicilio?",
    "¿Cómo hago un pedido?",
    "¿Qué beneficios tiene?"
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f0e8 0%, #e8f5e9 50%, #fff8e1 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', serif",
      padding: "16px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "480px",
        background: "white",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "90vh",
        maxHeight: "700px"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #2d6a2d 0%, #4a9e4a 100%)",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flexShrink: 0
        }}>
          <div style={{
            width: "52px", height: "52px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "26px", flexShrink: 0,
            border: "2px solid rgba(255,255,255,0.4)"
          }}>🐐</div>
          <div>
            <div style={{ color: "white", fontWeight: "bold", fontSize: "15px", lineHeight: 1.2 }}>
              CAPRILÁCTEOS LA ESPERANZA
            </div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", marginTop: "3px", fontFamily: "sans-serif" }}>
              <span style={{
                display: "inline-block", width: "7px", height: "7px",
                background: "#7fff7f", borderRadius: "50%", marginRight: "5px", verticalAlign: "middle"
              }}></span>
              Asistente virtual · Disponible 24/7
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "20px 16px",
          display: "flex", flexDirection: "column", gap: "12px"
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              alignItems: "flex-end", gap: "8px"
            }}>
              {msg.role === "assistant" && (
                <div style={{
                  width: "30px", height: "30px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #2d6a2d, #4a9e4a)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "15px", flexShrink: 0
                }}>🐐</div>
              )}
              <div style={{
                maxWidth: "78%",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #2d6a2d, #4a9e4a)"
                  : "#f7f7f5",
                color: msg.role === "user" ? "white" : "#2c2c2c",
                padding: "12px 16px",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                fontSize: "14px",
                lineHeight: "1.55",
                fontFamily: "sans-serif",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word"
              }}>
                {formatText(msg.content)}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
              <div style={{
                width: "30px", height: "30px", borderRadius: "50%",
                background: "linear-gradient(135deg, #2d6a2d, #4a9e4a)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px"
              }}>🐐</div>
              <div style={{
                background: "#f7f7f5", padding: "14px 18px",
                borderRadius: "18px 18px 18px 4px",
                display: "flex", gap: "5px", alignItems: "center"
              }}>
                {[0,1,2].map(j => (
                  <div key={j} style={{
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: "#4a9e4a",
                    animation: "bounce 1.2s infinite",
                    animationDelay: `${j * 0.2}s`
                  }}/>
                ))}
              </div>
            </div>
          )}

          {/* Suggested questions - only show at start */}
          {messages.length === 1 && (
            <div style={{ marginTop: "8px" }}>
              <div style={{ fontSize: "12px", color: "#888", fontFamily: "sans-serif", marginBottom: "8px", textAlign: "center" }}>
                Preguntas frecuentes
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                {suggestedQuestions.map((q, i) => (
                  <button key={i} onClick={() => { setInput(q); inputRef.current?.focus(); }} style={{
                    background: "white", border: "1.5px solid #4a9e4a", color: "#2d6a2d",
                    borderRadius: "20px", padding: "6px 14px", fontSize: "12px",
                    cursor: "pointer", fontFamily: "sans-serif", transition: "all 0.2s",
                    fontWeight: "500"
                  }}
                  onMouseEnter={e => e.target.style.background = "#f0faf0"}
                  onMouseLeave={e => e.target.style.background = "white"}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: "14px 16px",
          borderTop: "1px solid #efefef",
          background: "white",
          flexShrink: 0
        }}>
          <div style={{
            display: "flex", gap: "10px", alignItems: "flex-end",
            background: "#f7f7f5", borderRadius: "24px",
            padding: "8px 8px 8px 16px",
            border: "1.5px solid #e0e0e0"
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escríbeme tu pregunta..."
              rows={1}
              style={{
                flex: 1, border: "none", background: "transparent",
                fontSize: "14px", fontFamily: "sans-serif", resize: "none",
                outline: "none", lineHeight: "1.5", maxHeight: "80px",
                color: "#2c2c2c"
              }}
            />
            <button onClick={sendMessage} disabled={!input.trim() || loading} style={{
              width: "38px", height: "38px", borderRadius: "50%", border: "none",
              background: input.trim() && !loading
                ? "linear-gradient(135deg, #2d6a2d, #4a9e4a)"
                : "#ddd",
              color: "white", cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", flexShrink: 0, transition: "all 0.2s",
              boxShadow: input.trim() && !loading ? "0 2px 8px rgba(45,106,45,0.35)" : "none"
            }}>
              ➤
            </button>
          </div>
          <div style={{
            textAlign: "center", fontSize: "11px", color: "#bbb",
            fontFamily: "sans-serif", marginTop: "8px"
          }}>
            Nuestro equipo de ventas está listo para ayudarte 🐐
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #c8e6c9; border-radius: 4px; }
      `}</style>
    </div>
  );
}
