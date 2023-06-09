<script lang="ts">
  import { showPreview } from '$lib/stores/editor.store'
  import { scale } from 'svelte/transition'
  import { flip } from 'svelte/animate'
  import type { CustomError } from '$lib/types/error.interface'
  import { afterUpdate, onMount } from 'svelte'
  import { customSelect } from '$lib/utils/select.custom'
  import { tagsFromServer } from '$lib/utils/contents'
  import Editor from '$lib/components/Editor.svelte'
  import Preview from '$lib/components/Preview.svelte'
  import { tagList } from '$lib/stores/tag.store'

  let contentValue = '',
    titleValue = '',
    spanElement: HTMLSpanElement,
    italicsElement: HTMLElement,
    foregroundImageLabel: HTMLLabelElement,
    markup = '',
    errors: Array<CustomError> = [],
    suggestionPannel: HTMLDivElement,
    isPublished: boolean
</script>

<svelte:head>
  {#if $showPreview}
    <title>Article preview | JohnSpeaks</title>
  {:else}
    <title>Write an article | JohnSpeaks</title>
  {/if}
</svelte:head>

<section class="section feature" aria-label="feature">
  <div class="container">
    <h2 class="text-3xl font-semibold">
      {#if $showPreview}
        <span class="span">Article preview</span>
      {:else}
        <span class="span">Write an article</span>
      {/if}
    </h2>

    <div class="card-wrapper">
      {#if $showPreview}
        <Preview {markup} />
      {:else}
        <form class="form" method="POST" action="/send_post" datatype="application/json">
          {#if errors}
            {#each errors as error (error.id)}
              <p
                class="center error"
                transition:scale|local={{ start: 0.7 }}
                animate:flip={{ duration: 200 }}
              >
                {error.error}
              </p>
            {/each}
          {/if}

          <!-- 가로, 세로 크기 수정 -->
          <input
            type="text"
            name="title"
            bind:value={titleValue}
            class="input-field bg-neutral-100 dark:bg-neutral-900 w-full h-12 px-10 my-5 border rounded-md border-neutral-600 focus:outline-none focus:border-neutral-400"
            placeholder="New article title here..."
            maxlength="250"
            required
            data-input-field
          />

          <Editor bind:markup bind:contentValue />

          <button
            class="btn btn-primary center"
            type="submit"
            title="Create article. Ensure you fill all the fields in this form."
          >
            <span class="span">Create article</span>

            <i class="fa-solid fa-file-pen" />
          </button>
        </form>
      {/if}
    </div>
  </div>
</section>

<style>
  .btn {
    margin-top: 1rem;
    margin-left: auto;
    margin-right: auto;
  }
  .input-wrapper {
    display: flex;
    gap: 0;
    align-items: center;
    justify-content: center;
  }
  .input-wrapper input {
    width: 3rem;
  }
</style>
