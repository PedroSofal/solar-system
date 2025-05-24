# Solar System

Este projeto, ainda sem nome, se trata de um modelo 3D, em escala, do Sistema Solar, construído com Three.js, a partir de dados reais obtidos principalmente do sistema Horizons da NASA.

## Recursos principais

- **Máquina do tempo:** acelere a passagem do tempo, volte ao passado ou digite uma data personalizada para visualizar como era o Sistema Solar no momento exato em que você nasceu;

- **Informações sobre os corpos celestes:** busque por um planeta ou lua e descubra informações como a duração do período orbital, temperatura média, entre muitas outras;

- **Controle de camadas:** exiba ou oculte camadas como os rótulos e as linhas das órbitas, ou ative a iluminação de ambiente para melhor visualizar regiões inalcançadas pela luz solar;

- **Responsividade:** acesse pelo celular ou reduza a janela para o canto da tela sem perder funcionalidades;

- **Acesso offline:** por não depender de dados em tempo real, você pode continuar usando o app normalmente sem depender de internet, após iniciá-lo;

- **Performance otimizada:** o app utiliza culling, LOD e diversas outras técnicas para garantir a melhor experiência de performance, ao trabalhar com milhares de polígonos;

## Pontos de interesse

A cena compreende todos os planetas e planetas-anões, bem como seus respectivos satélites naturais.

Não deixe de visitar Saturno e chegar bem pertinho dos anéis construídos a partir de milhares de partículas otimizadas para performance, e de apreciar o nosso planeta Terra flutuando no espaço com sua camada de atmosfera e efeitos de shaders baseados na luz do Sol.

Atualizações futuras incluirão cometas e asteróides, além de anéis de planetas como Urano e Netuno, e formatos rochosos não esféricos para os corpos menores do Sistema Solar.

## Precisão

A física dos corpos segue o **modelo kepleriano** com precessões seculares (nodal e apsidal), baseado em elementos orbitais para a época J2000 (1º de janeiro de 2000 às 10h no Horário de Brasília).

Diferente de modelos n-body e modelos numéricos completos, o modelo com base kepleriana não considera perturbações gravitacionais, que podem resultar em órbitas altamente variáveis ao longo do tempo. Por esse motivo, quanto mais longe do J2000, a posição de algumas luas deve apresentar desvios em relação a um modelo mais preciso, como o Eyes on the Solar System, da NASA.

Na tentativa de mitigar essas imprecisões, foram feitos alguns ajustes finos nos dados de precessão apsidal e nodal, e períodos orbitais. Os exemplos de correções mais extremas são as luas Valetudo, S/2003 J 23, S/2022 J 1 e S/2022 J 2 de Júpiter, e as luas Bestla, Skrymir, S/2004 S 7 e S/2019 S 6 de Saturno.

# Créditos

Projeto desenvolvido por Pedro Sofal.

O banco de dados foi construído a partir da API [Le système solaire à portée de votre souris](https://api.le-systeme-solaire.net/), apesar de bastante modificada e atualizada com dados do [Horizons System, do Jet Propulsion Laboratory da NASA](https://ssd.jpl.nasa.gov/).

As texturas dos planetas, planetas-anões, Sol e Lua foram fornecidas pelo [Solar System Scope](https://www.solarsystemscope.com/textures/). Já as demais texturas foram baixadas do site [Free PBR](https://freepbr.com/).

A ideia do projeto nasceu de um curso básico de Three.js do canal [Zero to Mastery](https://www.youtube.com/watch?v=KM64t3pA4fs), no YouTube.
