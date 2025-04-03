# DeepSeek Model Installation Manual

## 📑DeekSeek Model Overview
####  Table of Contents
- [DeepSeek LLM Series](#deepseek-llm-series)
- [DeepSeek-Coder](#deepseek-coder)
  - [DeepSeek-Coder V2](#deepseek-coder-v2)
- [DeepSeek-V2](#deepseek-v2)
- [DeepSeek-V2.5](#deepseek-v25)
- [DeepSeek-V3](#deepseek-v3)
- [DeepSeek-R1 Series](#deepseek-r1-series)
- [DeepSeek-VL Series](#deepseek-vl-series)
- [DeepSeekMath](#deepseekmath)
- [DeepSeek-Prover](#deepseek-prover)
- [Janus-Pro-7B](#janus-pro-7b)

### DeepSeek LLM Series  
The **DeepSeek LLM** series includes foundational large language models in 7B and 67B sizes.  
- **DeepSeek LLM 7B Chat** and **67B Chat** are optimized for interactive dialogue tasks.  
- A **16B-parameter Mixture-of-Experts (MoE)** version has also been released, outperforming other open-source models in performance.

---

### DeepSeek-Coder  
A model series specifically designed for **code generation, completion, repair, and mathematical reasoning**.  
- The upgraded **DeepSeek-Coder V2** achieves significant advancements in code intelligence.

#### DeepSeek-Coder V2  
Built on the intermediate checkpoint of DeepSeek-V2, it was further pre-trained on **6 trillion tokens** of code and natural language, significantly enhancing capabilities in coding and mathematical reasoning while maintaining strong general language performance.  
- **Language support** expanded from 86 to **338 programming languages**, including both mainstream and niche languages.  
- With its **MoE architecture, large-scale pretraining, and multilingual support**, DeepSeek-Coder V2 sets a new benchmark in open-source code intelligence, challenging proprietary models in programming, math reasoning, and general tasks.

---

### DeepSeek-V2  
Released in early 2024, DeepSeek-V2 is an enhanced version of DeepSeekMoE, featuring:  
- Higher-quality data  
- Optimized training workflows  
- Focus on **text generation, code generation**, and **cost-efficient training**

---

### DeepSeek-V2.5  
An **intermediate version** released in **September 2024**, bridging **V2 and V3** in terms of performance and design.

---

### DeepSeek-V3  
Released in **December 2024**, this **third-generation model** brings major performance upgrades:  
- **FP8 mixed-precision training**  
- **Load-balanced optimization without auxiliary loss**  
- Supports **128K context length**  
- Inference speed improved from **20 TPS (V2)** to **60 TPS**, tripling generation speed  
It **outperforms other open-source models** in Q&A, long-form generation, and code tasks, and even surpasses proprietary models like GPT-4 in mathematical competitions—positioning itself as the **leader among open-source LLMs**.

---

### DeepSeek-R1 Series  
A series focused on **reasoning capabilities**, developed through reinforcement learning and multi-stage training.  
- **DeepSeek-R1-Zero**: An early version trained entirely via reinforcement learning  
- **DeepSeek-R1-32B**: A 32B parameter model that runs smoothly on a **24GB VRAM GPU**  
- **DeepSeek-R1-8B**: An 8B model optimized for **8GB VRAM GPUs**

---

### DeepSeek-VL Series  
Multimodal models capable of processing **image and text** jointly.  
- **DeepSeek-VL2** offers enhanced visual-language understanding

---

### DeepSeekMath  
A model specialized in **mathematical reasoning**.

---

### DeepSeek-Prover  
A model designed for **theorem proving**, trained on large-scale synthetic data.  
- **DeepSeek-Prover V1.5** integrates **reinforcement learning** and **Monte Carlo Tree Search (MCTS)** for optimization.

---

### Janus-Pro-7B  
A **vision-based model** released on **January 27, 2025**.

## DeepSeek Local Deployment
Recommended to use **[Ollama](https://ollama.com/)** tool. 

1. **Download Ollama**
First, visit the official [Ollama website](https://ollama.com/), download the appropriate version for your operating system, and follow the instructions to install it.

    Ollama is a tool for running and managing AI models locally. It allows you to interact with a variety of models directly on your machine.

2. **Download Model using Ollama**
We use model **DeepSeek R1 Model** as example.

    Next, open your terminal and run the following command:

    ```bash
    ollama run deepseek-r1:32b
    ```

    The part after the colon (`32b`) specifies the model size.

## 🔧 Common Ollama Commands

Here are some commonly used **Ollama** commands. Replace `{model_name}` with the actual name of the model you want to use.

- **Install a model**  
  ```bash
  ollama pull {model_name}
  ```

- **Run a model**  
  ```bash
  ollama run {model_name}
  ```  

- **Remove a model**  
  ```bash
  ollama rm {model_name}
  ```

- **List installed models**  
  ```bash
  ollama list
  ```



## Reference
https://github.com/deepseek-site/deepseek-free  