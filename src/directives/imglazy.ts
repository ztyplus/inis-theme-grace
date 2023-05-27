export default {
  mounted(el: HTMLEmbedElement, binding: { value: string }) {
    const obServer = new IntersectionObserver((entries) => {
      if (entries.find((v) => v.intersectionRatio)) {
        el.src = binding.value;
        obServer.unobserve(el);
      }
    });
    obServer.observe(el);
  },

  // unmounted() {},
};
