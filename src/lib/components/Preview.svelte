<script lang="ts">
  import hljs from 'highlight.js'
  import 'highlight.js/styles/github-dark.css'

  import { showPreview } from '$lib/stores/editor.store'
  import { onMount } from 'svelte'

  let articleContainer: HTMLDivElement

  onMount(() => {
    hljs.highlightAll()
    const blocks = articleContainer.querySelectorAll('pre code.hljs')
    blocks.forEach((value) => {
      value.setAttribute('style', 'background-color: transparent; padding:0')
    })
  })

  export let markup: string
  export let isEdit: boolean = true
</script>

<section class="section feature" aria-label="feature">
  <div class="container">
    <div>
      <div class="" bind:this={articleContainer}>
        <p>{@html markup}</p>
      </div>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        title="Continue editing"
        class=""
        on:click={() => {
          $showPreview = !showPreview
        }}
      >
        {#if isEdit}
          <i class="fa-solid fa-pen-to-square" />
        {/if}
      </div>
    </div>
  </div>
</section>