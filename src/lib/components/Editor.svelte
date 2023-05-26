<script lang="ts">
  import { showPreview } from '$lib/stores/editor.store'
  import { notification } from '$lib/stores/notification.store'
  import type { EditorContent } from '$lib/types/article.interface'
  //   import { redColor, sadEmoji } from '$lib/utils/contents'
  import { getCaretPosition, parseMarkdown, setCaretPosition } from '$lib/utils/editor.utils'
  import { onMount } from 'svelte'

  let contentTextArea: HTMLTextAreaElement
  export let contentValue: string
  export let markup: string

  let updateTexareaValue: any, useKeyCombinations: any
  onMount(() => {
    updateTexareaValue = (text: string) => {
      const { selectionEnd, selectionStart } = contentTextArea
      contentValue = `${contentValue.slice(0, selectionEnd)}${text}${contentValue.slice(
        selectionEnd
      )}`
      contentTextArea.focus({ preventScroll: false })
      setCaretPosition(contentTextArea, selectionStart, selectionStart + text.length / 2)
    }

    useKeyCombinations = (event: Event) => {
      let keysPressed: Record<string, boolean> = {}
      event.target?.addEventListener('keydown', (e) => {
        const keyEvent = e as KeyboardEvent
        keysPressed[keyEvent.key] = true

        if (
          (keysPressed['Control'] || keysPressed['Meta'] || keysPressed['Shift']) &&
          keyEvent.key == 'b'
        ) {
          updateTexareaValue(`****`)
        } else if (
          (keysPressed['Control'] || keysPressed['Meta'] || keysPressed['Shift']) &&
          keyEvent.key == 'i'
        ) {
          updateTexareaValue(`**`)
        } else if (
          (keysPressed['Control'] || keysPressed['Meta'] || keysPressed['Shift']) &&
          keyEvent.key === 'k'
        ) {
          updateTexareaValue(`[text](link)`)
          setCaretPosition(
            contentTextArea,
            getCaretPosition(contentTextArea).start,
            getCaretPosition(contentTextArea).start + `[text](link)`.length / 2
          )
        }
      })

      event.target?.addEventListener('keyup', (e) => {
        delete keysPressed[(e as KeyboardEvent).key]
      })
    }
  })
  const addBoldCommand = () => {
    updateTexareaValue(`****`)
  }
  const addItalicCommand = () => {
    updateTexareaValue(`**`)
  }
  const addLinkCommand = () => {
    updateTexareaValue(`[text](link)`)
  }
  const addUnorderedListCommand = () => {
    updateTexareaValue(`\n- First item\n- Second item\n`)
  }
  const addOrderedListCommand = () => {
    updateTexareaValue(`\n1. First item\n2. Second item\n`)
  }
  const addHeadingOneCommand = () => {
    updateTexareaValue(`\n# Your heading one {#id-name .class-name}\n\n`)
  }
  const addHeadingTwoCommand = () => {
    updateTexareaValue(`\n## Your heading one {#id-name .class-name}\n\n`)
  }
  const addHeadingThreeCommand = () => {
    updateTexareaValue(`\n### Your heading one {#id-name .class-name}\n\n`)
  }
  const addImageCommand = () => {
    updateTexareaValue(`![alt text](url)`)
  }
  const addCodeBlockCommand = () => {
    updateTexareaValue('\n```language\n<code here>\n```')
  }
  const addNoteCommand = () => {
    updateTexareaValue(
      '\n<div class="admonition note">\n<span class="title"><b>Note:</b> </span>\n<p></p>\n</div>'
    )
  }
  const addTipCommand = () => {
    updateTexareaValue(
      '\n<div class="admonition tip">\n<span class="title"><b>Tip:</b> </span>\n<p></p>\n</div>'
    )
  }
  const addWarningCommand = () => {
    updateTexareaValue(
      '\n<div class="admonition warning">\n<span class="title"><b>Warning:</b> </span>\n<p></p>\n</div>'
    )
  }
  const handlePreview = async (event: Event) => {
    const bodyEditor: EditorContent = {
      content: contentValue
    }

    markup = parseMarkdown(bodyEditor.content)
    if (markup.length >= 20) {
      $showPreview = !$showPreview
    } else {
      ;(event.target as HTMLElement).title =
        'To preview, ensure your content is at least 19 characters.'

      $notification = {
        message: `To preview, ensure your content is at least 19 characters ${sadEmoji}...`,
        backgroundColor: `${redColor}`
      }
    }
  }
</script>

<div class="flex flex-wrap">
  <div class="flex">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p on:click={addBoldCommand} class="p-4 cursor-pointer">
      <i class="fa-solid fa-bold" />
      <span class="tooltiptext">Bold command [Cmd/Ctrl(Shift) + B]</span>
    </p>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p class="p-4 cursor-pointer" on:click={addItalicCommand}>
      <i class="fa-solid fa-italic" />
      <span class="tooltiptext"> Italics command [Cmd/Ctrl(Shift) + I] </span>
    </p>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p class="p-4 cursor-pointer" on:click={addLinkCommand}>
      <i class="fa-solid fa-link" />
      <span class="tooltiptext">Add link command [Cmd/Ctrl(Shift) + K]</span>
    </p>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p class="p-4 cursor-pointer" on:click={addUnorderedListCommand}>
      <i class="fa-solid fa-list" />
      <span class="tooltiptext">Add unordered list command</span>
    </p>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p class="p-4 cursor-pointer" on:click={addOrderedListCommand}>
      <i class="fa-solid fa-list-ol" />
      <span class="tooltiptext">Add ordered list command</span>
    </p>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p class="p-4 cursor-pointer" on:click={addHeadingOneCommand}>
      <i class="fa-solid fa-h" /><sub>1</sub>
      <span class="tooltiptext">Heading 1 command</span>
    </p>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p class="p-4 cursor-pointer" on:click={addHeadingTwoCommand}>
      <i class="fa-solid fa-h" /><sub>2</sub>
      <span class="tooltiptext">Heading 2 command</span>
    </p>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p class="p-4 cursor-pointer" on:click={addHeadingThreeCommand}>
      <i class="fa-solid fa-h" /><sub>3</sub>
      <span class="tooltiptext">Heading 3 command</span>
    </p>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p class="p-4 cursor-pointer" on:click={addImageCommand}>
      <i class="fa-solid fa-image" />
      <span class="tooltiptext">Add image command</span>
    </p>
  </div>
  <div class="flex">
    <p class="p-4 inline-block relative cursor-pointer">
      <i class="fa-solid fa-ellipsis-vertical dropbtn" />
      <span class="dropdown-content">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <small on:click={addNoteCommand}>Add note</small>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <small on:click={addTipCommand}>Add tip</small>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <small on:click={addWarningCommand}>Add warning</small>
      </span>
    </p>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p class="p-4 cursor-pointer" on:click={addCodeBlockCommand}>
      <i class="fa-solid fa-code" />
      <span class="tooltiptext">Code block command</span>
    </p>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p class="p-4 cursor-pointer" on:click={(e) => handlePreview(e)}>
      <i class="fa-solid fa-eye" />
    </p>
  </div>
</div>

<textarea
  bind:this={contentTextArea}
  bind:value={contentValue}
  on:focus={(event) => {
    if (event.target) {
      useKeyCombinations(event)
    }
  }}
  name="content"
  class="w-full"
  id="textAreaContent"
  placeholder="Write your article content here (markdown supported)..."
  data-input-field
  required
/>


<style>
    .tooltiptext {
        visibility: hidden;
        min-width: 120px;
        font-size: var(--fontSize-8);
        background: 0 0;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px;
        position: absolute;
        z-index: 1;
        bottom: 110%;
        left: 50%;
        margin-left: -60px;
        opacity: 0;
        transition: all .3s;
    }
    .dropdown-content {
    display: none;
    position: absolute;
    background: var(--bg-prussian-blue);
    min-width: max-content;
    box-shadow: 0 8px 16px #0003;
    z-index: 1;
}
</style>