Install Gemma3 model with tool **llama.cpp**

- Auth
```bash
huggingface-cli login
```

- Configure environment variable for HF token
```bash
export HF_TOKEN=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
```

- Install from brew
```bash
brew install brew
```

- load and run the model:
```bash
llama-cli -hf google/gemma-3-12b-it-qat-q4_0-gguf:Q4_0
```

Reference:

https://huggingface.co/google/gemma-3-12b-it-qat-q4_0-gguf?show_file_info=gemma-3-12b-it-q4_0.gguf&local-app=llama.cpp


