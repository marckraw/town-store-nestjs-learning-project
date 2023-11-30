import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { LanguageService } from '../shared/language/language.service';
// 8.8.4 biblioteka obsługująca (q-factor weighting)
import acceptLanguage from 'accept-language';

@Injectable()
export class LanguageExtractorMiddleware implements NestMiddleware {
  private logger = new Logger(LanguageExtractorMiddleware.name);

  constructor(private languageService: LanguageService) {
    // fallback języka do en, jeśli żaden nieustawiony (bo en pierwszy!)
    acceptLanguage.languages(
      this.languageService.supportedLanguages() as unknown as string[],
    );
  }

  use(req: Request, res: Response, next: () => void) {
    this.logger.debug('Extracting language from request...');
    req['language'] = req.headers['accept-language'] || 'en'; // fallback języka do en, jeśli żaden nie ustawiony
    next();
  }
}
