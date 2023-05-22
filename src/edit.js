import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {
	return (
		<div { ...useBlockProps() }>
			<InnerBlocks
        allowedBlocks={['core/gallery', 'create-block/uncommon-audio-player', 'create-block/uncommon-cta-popup']}
        template={[
          ['core/gallery', { className: 'uncommon-ourpork-gallery-content' }],
          ['create-block/uncommon-audio-player'],
          ['create-block/uncommon-cta-popup']
        ]}
      />
		</div>
	);
}
