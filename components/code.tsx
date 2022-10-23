import {Children, ReactElement, useMemo} from 'react';
import clsx from 'clsx';
import styles from './code.module.css';
import {useCurrentLanguage} from '../context/code';

export interface Props {
	children: ReactElement[];
}

export function Code(props: Props) {
	const children = useMemo(() => {
		return Children.map(props.children, child => {
			if (Array.isArray(child.props.children)) {
				if (child.props.children.length !== 2) {
					throw new Error(
						'Code component must have exactly two children, title and codeblock',
					);
				}

				const title = child.props.children[0].props.children as string;

				const language = child.props.children[1].props.children.props[
					'data-language'
				] as string;

				return {
					title,
					language,
					Component: child.props.children[1],
				};
			}

			const language = child.props.children.props.children.props[
				'data-language'
			] as string;

			return {
				language,
				Component: child,
			};
		});
	}, [props.children]);

	const [activeLanguage, setActiveLanguage] = useCurrentLanguage(
		children.map(child => child.language),
	);

	const activeTitle =
		children.find(child => child.language === activeLanguage)?.title ?? null;

	return (
		<div
			className={clsx(
				'flex flex-col my-5 dark:bg-black rounded-lg space-y-2 p-3 border border-neutral-100 dark:border-neutral-900',
				styles.code__container,
			)}
		>
			<div className="flex max-w-full items-center space-x-2 overflow-x-auto justify-between">
				{children.map(child => {
					const active = activeLanguage === child.language;

					return (
						<div
							key={child.language}
							className="px-3 first-of-type:pl-0 last-of-type:pr-0"
						>
							<button
								className={clsx(
									'transition-colors px-6 py-1 text-xs uppercase tracking-widest inline-block rounded-md',
									{
										'bg-primary-500 text-primary-50 dark:bg-neutral-800':
											active,
										'hover:bg-neutral-100 dark:hover:bg-neutral-900': !active,
									},
								)}
								onClick={() => setActiveLanguage(child.language)}
							>
								{child.language}
							</button>
						</div>
					);
				})}

				{activeTitle && (
					<p className="text-neutral-500 dark:text-neutral-400">
						{activeTitle}
					</p>
				)}
			</div>

			<div>
				{children.map(child => {
					const active = activeLanguage === child.language;

					return (
						<div key={child.language} className={active ? 'block' : 'hidden'}>
							{child.Component}
						</div>
					);
				})}
			</div>
		</div>
	);
}