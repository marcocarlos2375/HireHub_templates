<template>
  <div class="faq-container">
    <h2 class="faq-title">Frequently Asked Questions</h2>
    <div class="faq-list">
      <div v-for="(item, index) in faqItems" :key="index" class="faq-item">
        <button 
          class="faq-question" 
          @click="toggleAnswer(index)"
          :aria-expanded="activeIndex === index"
        >
          {{ item.question }}
          <span class="icon" :class="{ 'rotated': activeIndex === index }">▼</span>
        </button>
        <div 
          class="faq-answer" 
          v-show="activeIndex === index"
          role="region"
        >
          {{ item.answer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeIndex = ref(null)

const faqItems = [
  {
    question: 'How do I get started?',
    answer: 'Getting started is easy! Simply sign up for an account and follow our quick onboarding process.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers.'
  },
  {
    question: 'How can I contact support?',
    answer: 'You can reach our support team 24/7 through our help desk, email, or live chat.'
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes! We offer a 14-day free trial with full access to all features.'
  }
]

const toggleAnswer = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index
}
</script>

<style scoped>
.faq-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.faq-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.faq-question {
  width: 100%;
  padding: 1rem;
  background: #f8fafc;
  border: none;
  text-align: left;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.faq-question:hover {
  background: #f1f5f9;
}

.icon {
  font-size: 0.8em;
  transition: transform 0.2s;
}

.icon.rotated {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 1rem;
  background: white;
  line-height: 1.6;
}
</style>

